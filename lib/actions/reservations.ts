"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"

// Types for better type safety
export type CreateReservationData = {
  customerName: string
  customerEmail: string
  customerPhone?: string
  tableId: string
  date: Date
  time: Date
  partySize: number
  specialNotes?: string
}

export type ReservationWithDetails = Prisma.ReservationGetPayload<{
  include: { user: true; table: true }
}>

export type TableWithReservations = Prisma.TableGetPayload<{
  include: { reservations: true }
}>

// ========================
// RESERVATION ACTIONS
// ========================

export async function createReservation(data: CreateReservationData) {
  try {
    // Validate input data
    if (!data.customerEmail || !data.customerName || !data.tableId || !data.date || !data.time) {
      throw new Error("Missing required fields")
    }

    if (data.partySize < 1 || data.partySize > 50) {
      throw new Error("Invalid party size")
    }

    // Check if the date is in the past
    const now = new Date()
    const reservationDateTime = new Date(data.date)
    reservationDateTime.setHours(data.time.getHours(), data.time.getMinutes())

    if (reservationDateTime < now) {
      throw new Error("Cannot make reservations for past dates")
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: data.customerEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.customerEmail,
          name: data.customerName,
          phone: data.customerPhone,
          role: "CUSTOMER",
        },
      })
    } else {
      // Update user info if provided and different
      if (user.name !== data.customerName || user.phone !== data.customerPhone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: data.customerName,
            phone: data.customerPhone,
          },
        })
      }
    }

    // Check if table exists and has enough capacity
    const table = await prisma.table.findUnique({
      where: { id: data.tableId },
    })

    if (!table) {
      throw new Error("Table not found")
    }

    if (!table.available) {
      throw new Error("Table is not available")
    }

    if (table.capacity < data.partySize) {
      throw new Error(`Table capacity (${table.capacity}) is less than party size (${data.partySize})`)
    }

    // Check for conflicting reservations (within 2 hours of the requested time)
    const timeBuffer = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    const startTimeCheck = new Date(reservationDateTime.getTime() - timeBuffer)
    const endTimeCheck = new Date(reservationDateTime.getTime() + timeBuffer)

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        tableId: data.tableId,
        status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
        AND: {
          time: {
            gte: startTimeCheck,
            lte: endTimeCheck,
          },
        },
      },
    })

    if (conflictingReservation) {
      throw new Error("Table is already reserved during this time period")
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        tableId: data.tableId,
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        specialNotes: data.specialNotes,
        status: "PENDING",
      },
      include: {
        user: true,
        table: true,
      },
    })

    revalidatePath("/reservations")
    revalidatePath("/admin/reservations")

    return {
      success: true,
      data: reservation,
      message: "Reservation created successfully",
    }
  } catch (error) {
    console.error("Error creating reservation:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Failed to create reservation" }
  }
}

export async function updateReservationStatus(
  reservationId: string,
  status: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED",
) {
  try {
    if (!reservationId || !status) {
      throw new Error("Missing required parameters")
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    })

    if (!reservation) {
      throw new Error("Reservation not found")
    }

    // Business logic for status transitions
    if (reservation.status === "COMPLETED" || reservation.status === "CANCELLED") {
      throw new Error("Cannot update status of completed or cancelled reservations")
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        table: true,
      },
    })

    revalidatePath("/reservations")
    revalidatePath("/admin/reservations")

    return {
      success: true,
      data: updatedReservation,
      message: "Reservation status updated successfully",
    }
  } catch (error) {
    console.error("Error updating reservation status:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Failed to update reservation status" }
  }
}

export async function cancelReservation(reservationId: string, userId?: string) {
  try {
    if (!reservationId) {
      throw new Error("Reservation ID is required")
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true },
    })

    if (!reservation) {
      throw new Error("Reservation not found")
    }

    // If userId is provided, ensure the user owns the reservation
    if (userId && reservation.userId !== userId) {
      throw new Error("You can only cancel your own reservations")
    }

    if (reservation.status === "CANCELLED") {
      throw new Error("Reservation is already cancelled")
    }

    if (reservation.status === "COMPLETED") {
      throw new Error("Cannot cancel completed reservations")
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
      include: {
        user: true,
        table: true,
      },
    })

    revalidatePath("/reservations")
    revalidatePath("/admin/reservations")

    return {
      success: true,
      data: updatedReservation,
      message: "Reservation cancelled successfully",
    }
  } catch (error) {
    console.error("Error cancelling reservation:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Failed to cancel reservation" }
  }
}

export async function getReservationById(reservationId: string) {
  try {
    if (!reservationId) {
      throw new Error("Reservation ID is required")
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        table: true,
      },
    })

    if (!reservation) {
      return { success: false, error: "Reservation not found" }
    }

    return { success: true, data: reservation }
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return { success: false, error: "Failed to fetch reservation" }
  }
}

export async function getReservationsByUser(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required")
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        table: true,
      },
      orderBy: { date: "desc" },
    })

    return { success: true, data: reservations }
  } catch (error) {
    console.error("Error fetching user reservations:", error)
    return { success: false, error: "Failed to fetch reservations" }
  }
}

export async function getAllReservations(
  status?: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED",
  date?: Date,
  limit?: number,
) {
  try {
    const where: Prisma.ReservationWhereInput = {}

    if (status) {
      where.status = status
    }

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: true,
        table: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: limit,
    })

    return { success: true, data: reservations }
  } catch (error) {
    console.error("Error fetching all reservations:", error)
    return { success: false, error: "Failed to fetch reservations" }
  }
}

// ========================
// TABLE ACTIONS
// ========================

export async function getAllTables() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: "asc" },
      include: {
        reservations: {
          where: {
            status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
          },
          orderBy: { date: "asc" },
        },
      },
    })

    return { success: true, data: tables }
  } catch (error) {
    console.error("Error fetching tables:", error)
    return { success: false, error: "Failed to fetch tables" }
  }
}

export async function getAvailableTables(date: Date, time: Date, partySize: number, excludeReservationId?: string) {
  try {
    if (!date || !time || !partySize) {
      throw new Error("Date, time, and party size are required")
    }

    if (partySize < 1) {
      throw new Error("Party size must be at least 1")
    }

    // Create the exact reservation datetime
    const reservationDateTime = new Date(date)
    reservationDateTime.setHours(time.getHours(), time.getMinutes())

    // Check for conflicts within 2 hours
    const timeBuffer = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    const startTimeCheck = new Date(reservationDateTime.getTime() - timeBuffer)
    const endTimeCheck = new Date(reservationDateTime.getTime() + timeBuffer)

    const whereClause: Prisma.TableWhereInput = {
      capacity: { gte: partySize },
      available: true,
      reservations: {
        none: {
          status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
          time: {
            gte: startTimeCheck,
            lte: endTimeCheck,
          },
          ...(excludeReservationId && {
            id: { not: excludeReservationId },
          }),
        },
      },
    }

    const tables = await prisma.table.findMany({
      where: whereClause,
      orderBy: { capacity: "asc" },
      include: {
        reservations: {
          where: {
            status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
            date: {
              gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            },
          },
        },
      },
    })

    return { success: true, data: tables }
  } catch (error) {
    console.error("Error fetching available tables:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Failed to fetch available tables" }
  }
}

export async function createTable(data: {
  number: number
  capacity: number
  location?: string
}) {
  try {
    if (!data.number || !data.capacity) {
      throw new Error("Table number and capacity are required")
    }

    if (data.capacity < 1) {
      throw new Error("Table capacity must be at least 1")
    }

    // Check if table number already exists
    const existingTable = await prisma.table.findUnique({
      where: { number: data.number },
    })

    if (existingTable) {
      throw new Error("Table number already exists")
    }

    const table = await prisma.table.create({
      data: {
        number: data.number,
        capacity: data.capacity,
        location: data.location,
        available: true,
      },
    })

    revalidatePath("/admin/tables")
    revalidatePath("/reservations")

    return {
      success: true,
      data: table,
      message: "Table created successfully",
    }
  } catch (error) {
    console.error("Error creating table:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Failed to create table" }
  }
}

export async function updateTableAvailability(tableId: string, available: boolean) {
  try {
    if (!tableId) {
      throw new Error("Table ID is required")
    }

    const table = await prisma.table.update({
      where: { id: tableId },
      data: { available },
    })

    revalidatePath("/admin/tables")
    revalidatePath("/reservations")

    return {
      success: true,
      data: table,
      message: `Table ${available ? "enabled" : "disabled"} successfully`,
    }
  } catch (error) {
    console.error("Error updating table availability:", error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: "Failed to update table availability" }
  }
}

// ========================
// UTILITY FUNCTIONS
// ========================

export async function getTables() {
  return getAllTables()
}

export async function getReservationStats(date?: Date) {
  try {
    const where: Prisma.ReservationWhereInput = {}

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const [total, pending, confirmed, seated, completed, cancelled] = await Promise.all([
      prisma.reservation.count({ where }),
      prisma.reservation.count({ where: { ...where, status: "PENDING" } }),
      prisma.reservation.count({ where: { ...where, status: "CONFIRMED" } }),
      prisma.reservation.count({ where: { ...where, status: "SEATED" } }),
      prisma.reservation.count({ where: { ...where, status: "COMPLETED" } }),
      prisma.reservation.count({ where: { ...where, status: "CANCELLED" } }),
    ])

    return {
      success: true,
      data: {
        total,
        pending,
        confirmed,
        seated,
        completed,
        cancelled,
      },
    }
  } catch (error) {
    console.error("Error fetching reservation stats:", error)
    return { success: false, error: "Failed to fetch reservation statistics" }
  }
}

export async function getUpcomingReservations(limit = 10) {
  try {
    const now = new Date()

    const reservations = await prisma.reservation.findMany({
      where: {
        time: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: {
        user: true,
        table: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: limit,
    })

    return { success: true, data: reservations }
  } catch (error) {
    console.error("Error fetching upcoming reservations:", error)
    return { success: false, error: "Failed to fetch upcoming reservations" }
  }
}
