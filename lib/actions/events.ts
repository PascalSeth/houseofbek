"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        available: true,
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
    })
    return { success: true, data: events }
  } catch (error) {
    console.error("Error fetching events:", error)
    return { success: false, error: "Failed to fetch events" }
  }
}

export async function createEventBooking(data: {
  eventId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  partySize: number
  specialNotes?: string
}) {
  try {
    // Check if event has capacity
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: {
        bookings: {
          where: { status: { in: ["PENDING", "CONFIRMED"] } },
        },
      },
    })

    if (!event) {
      return { success: false, error: "Event not found" }
    }

    const currentBookings = event.bookings.reduce((sum, booking) => sum + booking.partySize, 0)
    if (currentBookings + data.partySize > event.capacity) {
      return { success: false, error: "Event is fully booked" }
    }

    const booking = await prisma.eventBooking.create({
      data: {
        ...data,
        totalAmount: event.price ? (Number(event.price) * data.partySize) : null,
      },
      include: { event: true },
    })

    revalidatePath("/events")
    return { success: true, data: booking }
  } catch (error) {
    console.error("Error creating event booking:", error)
    return { success: false, error: "Failed to create event booking" }
  }
}

export async function getEventBookings(eventId: string) {
  try {
    const bookings = await prisma.eventBooking.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: bookings }
  } catch (error) {
    console.error("Error fetching event bookings:", error)
    return { success: false, error: "Failed to fetch event bookings" }
  }
}
