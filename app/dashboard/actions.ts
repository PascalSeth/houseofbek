"use server"

import { prisma } from "@/lib/prisma" // Adjust import path as needed
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { ReservationStatus, OrderStatus, OrderType } from "@prisma/client"
import { uploadFileToStorage } from "@/lib/supabase" // Import the manual Supabase setup

// =============================================================================
// ORDERS ACTIONS
// =============================================================================

const orderSchema = z.object({
  userId: z.string(),
  orderType: z.enum(["DINE_IN", "TAKEOUT", "DELIVERY"]), // Use proper enum values
  pickupTime: z.string().datetime().optional(),
  specialNotes: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
      notes: z.string().optional(),
    }),
  ),
})

export async function createOrder(data: z.infer<typeof orderSchema>) {
  try {
    const validatedData = orderSchema.parse(data)

    // Calculate total amount
    let totalAmount = 0
    const orderItems = []

    for (const item of validatedData.items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      })

      if (!menuItem) continue

      const itemTotal = menuItem.price.toNumber() * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes,
      })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const order = await prisma.order.create({
      data: {
        userId: validatedData.userId,
        orderNumber,
        orderType: validatedData.orderType as OrderType, // Proper type casting
        totalAmount,
        pickupTime: validatedData.pickupTime ? new Date(validatedData.pickupTime) : null,
        specialNotes: validatedData.specialNotes,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    })

    revalidatePath("/dashboard/orders")
    return { success: true, data: order }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // Validate status against OrderStatus enum
    const validStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]
    
    if (!validStatuses.includes(status as OrderStatus)) {
      return { success: false, error: "Invalid order status" }
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus }, // Proper type casting
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: true,
      },
    })

    revalidatePath("/dashboard/orders")
    return { success: true, data: order }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Failed to update order status" }
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, data: orders }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { success: false, error: "Failed to fetch orders" }
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    })

    revalidatePath("/dashboard/orders")
    return { success: true }
  } catch (error) {
    console.error("Error deleting order:", error)
    return { success: false, error: "Failed to delete order" }
  }
}

// =============================================================================
// RESERVATIONS ACTIONS
// =============================================================================

const reservationSchema = z.object({
  userId: z.string(),
  tableId: z.string(),
  date: z.string().datetime(),
  time: z.string().datetime(),
  partySize: z.number().min(1),
  specialNotes: z.string().optional(),
})

export async function createReservation(data: z.infer<typeof reservationSchema>) {
  try {
    const validatedData = reservationSchema.parse(data)

    const reservation = await prisma.reservation.create({
      data: {
        userId: validatedData.userId,
        tableId: validatedData.tableId,
        date: new Date(validatedData.date),
        time: new Date(validatedData.time),
        partySize: validatedData.partySize,
        specialNotes: validatedData.specialNotes,
      },
      include: {
        user: true,
        table: true,
      },
    })

    revalidatePath("/dashboard/reservations")
    return { success: true, data: reservation }
  } catch (error) {
    console.error("Error creating reservation:", error)
    return { success: false, error: "Failed to create reservation" }
  }
}

export async function updateReservationStatus(reservationId: string, status: ReservationStatus) {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
      include: {
        user: true,
        table: true,
      },
    })

    revalidatePath("/dashboard/reservations")
    return { success: true, data: reservation }
  } catch (error) {
    console.error("Error updating reservation status:", error)
    return { success: false, error: "Failed to update reservation status" }
  }
}

export async function getReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        table: true,
      },
      orderBy: {
        date: "asc",
      },
    })

    return { success: true, data: reservations }
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return { success: false, error: "Failed to fetch reservations" }
  }
}

export async function deleteReservation(reservationId: string) {
  try {
    await prisma.reservation.delete({
      where: { id: reservationId },
    })

    revalidatePath("/dashboard/reservations")
    return { success: true }
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return { success: false, error: "Failed to delete reservation" }
  }
}

// =============================================================================
// STAFF ACTIONS
// =============================================================================

const staffSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(["STAFF", "ADMIN"]), // Using string literal enum instead of UserRole
})

export async function createStaff(data: z.infer<typeof staffSchema>) {
  try {
    const validatedData = staffSchema.parse(data)

    const staff = await prisma.user.create({
      data: validatedData,
    })

    revalidatePath("/dashboard/staff")
    return { success: true, data: staff }
  } catch (error) {
    console.error("Error creating staff:", error)
    return { success: false, error: "Failed to create staff member" }
  }
}

export async function updateStaff(staffId: string, data: Partial<z.infer<typeof staffSchema>>) {
  try {
    const staff = await prisma.user.update({
      where: { id: staffId },
      data,
    })

    revalidatePath("/dashboard/staff")
    return { success: true, data: staff }
  } catch (error) {
    console.error("Error updating staff:", error)
    return { success: false, error: "Failed to update staff member" }
  }
}

export async function getStaff() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: ["STAFF", "ADMIN"], // Using string literal enum instead of UserRole
        },
      },
      include: {
        _count: {
          select: {
            orders: true,
            reservations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, data: staff }
  } catch (error) {
    console.error("Error fetching staff:", error)
    return { success: false, error: "Failed to fetch staff" }
  }
}

export async function deleteStaff(staffId: string) {
  try {
    await prisma.user.delete({
      where: { id: staffId },
    })

    revalidatePath("/dashboard/staff")
    return { success: true }
  } catch (error) {
    console.error("Error deleting staff:", error)
    return { success: false, error: "Failed to delete staff member" }
  }
}

// =============================================================================
// CATEGORIES ACTIONS
// =============================================================================

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().default(0),
})

export async function createCategory(data: z.infer<typeof categorySchema>) {
  try {
    const validatedData = categorySchema.parse(data)

    const category = await prisma.category.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    })

    revalidatePath("/dashboard/categories")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategory(categoryId: string, data: Partial<z.infer<typeof categorySchema>>) {
  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    })

    revalidatePath("/dashboard/categories")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    return { success: true, data: categories }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    // Check if category has menu items
    const menuItemCount = await prisma.menuItem.count({
      where: { categoryId },
    })

    if (menuItemCount > 0) {
      return { success: false, error: "Cannot delete category with menu items" }
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    revalidatePath("/dashboard/categories")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

// =============================================================================
// MENU ACTIONS
// =============================================================================

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string(),
  preparationTime: z.number().positive().optional(),
  available: z.boolean().default(true),
})

export async function createMenuItem(data: z.infer<typeof menuItemSchema>) {
  try {
    const validatedData = menuItemSchema.parse(data)

    const menuItem = await prisma.menuItem.create({
      data: validatedData,
      include: {
        category: true,
      },
    })

    revalidatePath("/dashboard/menu")
    return { success: true, data: menuItem }
  } catch (error) {
    console.error("Error creating menu item:", error)
    return { success: false, error: "Failed to create menu item" }
  }
}

export async function updateMenuItem(menuItemId: string, data: Partial<z.infer<typeof menuItemSchema>>) {
  try {
    const menuItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data,
      include: {
        category: true,
      },
    })

    revalidatePath("/dashboard/menu")
    return { success: true, data: menuItem }
  } catch (error) {
    console.error("Error updating menu item:", error)
    return { success: false, error: "Failed to update menu item" }
  }
}

export async function getMenuItems(categoryId?: string) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { success: true, data: menuItems }
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return { success: false, error: "Failed to fetch menu items" }
  }
}

export async function deleteMenuItem(menuItemId: string) {
  try {
    await prisma.menuItem.delete({
      where: { id: menuItemId },
    })

    revalidatePath("/dashboard/menu")
    return { success: true }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return { success: false, error: "Failed to delete menu item" }
  }
}

// =============================================================================
// REVIEWS ACTIONS
// =============================================================================

const reviewSchema = z.object({
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function createReview(data: z.infer<typeof reviewSchema>) {
  try {
    const validatedData = reviewSchema.parse(data)

    const review = await prisma.review.create({
      data: validatedData,
      include: {
        user: true,
      },
    })

    revalidatePath("/dashboard/reviews")
    return { success: true, data: review }
  } catch (error) {
    console.error("Error creating review:", error)
    return { success: false, error: "Failed to create review" }
  }
}

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, data: reviews }
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return { success: false, error: "Failed to fetch reviews" }
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await prisma.review.delete({
      where: { id: reviewId },
    })

    revalidatePath("/dashboard/reviews")
    return { success: true }
  } catch (error) {
    console.error("Error deleting review:", error)
    return { success: false, error: "Failed to delete review" }
  }
}

// =============================================================================
// TABLE ACTIONS (Bonus)
// =============================================================================

const tableSchema = z.object({
  number: z.number().positive(),
  capacity: z.number().positive(),
  location: z.string().optional(),
  available: z.boolean().default(true),
})

export async function createTable(data: z.infer<typeof tableSchema>) {
  try {
    const validatedData = tableSchema.parse(data)

    const table = await prisma.table.create({
      data: validatedData,
    })

    revalidatePath("/dashboard/tables")
    return { success: true, data: table }
  } catch (error) {
    console.error("Error creating table:", error)
    return { success: false, error: "Failed to create table" }
  }
}

export async function getTables() {
  try {
    const tables = await prisma.table.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    })

    return { success: true, data: tables }
  } catch (error) {
    console.error("Error fetching tables:", error)
    return { success: false, error: "Failed to fetch tables" }
  }
}

export async function updateTable(tableId: string, data: Partial<z.infer<typeof tableSchema>>) {
  try {
    const table = await prisma.table.update({
      where: { id: tableId },
      data,
    })

    revalidatePath("/dashboard/tables")
    return { success: true, data: table }
  } catch (error) {
    console.error("Error updating table:", error)
    return { success: false, error: "Failed to update table" }
  }
}

export async function deleteTable(tableId: string) {
  try {
    await prisma.table.delete({
      where: { id: tableId },
    })

    revalidatePath("/dashboard/tables")
    return { success: true }
  } catch (error) {
    console.error("Error deleting table:", error)
    return { success: false, error: "Failed to delete table" }
  }
}

// =============================================================================
// DASHBOARD STATS FUNCTIONS
// =============================================================================

export type DashboardStats = {
  totalOrders: number
  totalRevenue: number
  ordersToday: number
  revenueToday: number
  activeReservations: number
  averageRating: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get total orders and revenue
    const totalOrdersResult = await prisma.order.aggregate({
      _count: { id: true },
      _sum: { totalAmount: true },
    })

    // Get today's orders and revenue
    const todayOrdersResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    })

    // Get active reservations (next 24 hours)
    const activeReservationsResult = await prisma.reservation.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ["PENDING", "CONFIRMED", "SEATED"],
        },
      },
    })

    // Get average rating
    const averageRatingResult = await prisma.review.aggregate({
      _avg: { rating: true },
    })

    return {
      totalOrders: totalOrdersResult._count.id || 0,
      totalRevenue: Number(totalOrdersResult._sum.totalAmount) || 0,
      ordersToday: todayOrdersResult._count.id || 0,
      revenueToday: Number(todayOrdersResult._sum.totalAmount) || 0,
      activeReservations: activeReservationsResult || 0,
      averageRating: Number(averageRatingResult._avg.rating?.toFixed(1)) || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalOrders: 0,
      totalRevenue: 0,
      ordersToday: 0,
      revenueToday: 0,
      activeReservations: 0,
      averageRating: 0,
    }
  }
}

export async function getRecentOrders() {
  try {
    const result = await prisma.order.findMany({
      take: 5,
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return result
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return []
  }
}

export async function getUpcomingReservations() {
  try {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const result = await prisma.reservation.findMany({
      where: {
        date: {
          gte: today,
          lte: nextWeek,
        },
        status: {
          in: ["PENDING", "CONFIRMED", "SEATED"],
        },
      },
      take: 5,
      include: {
        user: true,
        table: true,
      },
      orderBy: {
        date: "asc",
      },
    })

    return result
  } catch (error) {
    console.error("Error fetching upcoming reservations:", error)
    return []
  }
}

// =============================================================================
// ANALYTICS FUNCTIONS
// =============================================================================

export type AnalyticsData = {
  dailyRevenue: number
  ordersToday: number
  avgOrderValue: number
  customerSatisfaction: number
  revenueChange: number
  ordersChange: number
  avgOrderChange: number
  satisfactionChange: number
  topDishes: Array<{
    name: string
    orders: number
    revenue: number
    category: string
  }>
  revenueChart: Array<{
    date: string
    revenue: number
    orders: number
  }>
  categoryStats: Array<{
    name: string
    revenue: number
    orders: number
    percentage: number
  }>
  orderStatusDistribution: Array<{
    status: string
    count: number
    percentage: number
  }>
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    // Get today's metrics
    const todayOrders = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    })

    // Get yesterday's metrics for comparison
    const yesterdayOrders = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    })

    // Calculate changes
    const dailyRevenue = Number(todayOrders._sum.totalAmount) || 0
    const ordersToday = todayOrders._count.id || 0
    const avgOrderValue = ordersToday > 0 ? dailyRevenue / ordersToday : 0

    const yesterdayRevenue = Number(yesterdayOrders._sum.totalAmount) || 0
    const yesterdayOrderCount = yesterdayOrders._count.id || 0
    const yesterdayAvgOrder = yesterdayOrderCount > 0 ? yesterdayRevenue / yesterdayOrderCount : 0

    const revenueChange = yesterdayRevenue > 0 ? ((dailyRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0
    const ordersChange = yesterdayOrderCount > 0 ? ((ordersToday - yesterdayOrderCount) / yesterdayOrderCount) * 100 : 0
    const avgOrderChange = yesterdayAvgOrder > 0 ? ((avgOrderValue - yesterdayAvgOrder) / yesterdayAvgOrder) * 100 : 0

    // Get customer satisfaction
    const reviews = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { id: true },
    })
    const customerSatisfaction = Number(reviews._avg.rating?.toFixed(1)) || 0

    // Get last week's average rating for comparison
    const lastWeekReviews = await prisma.review.aggregate({
      where: {
        createdAt: {
          gte: lastWeek,
          lt: today,
        },
      },
      _avg: { rating: true },
    })
    const lastWeekRating = Number(lastWeekReviews._avg.rating) || 0
    const satisfactionChange = lastWeekRating > 0 ? customerSatisfaction - lastWeekRating : 0

    // Get top dishes
    const topDishesData = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    })

    const topDishes = await Promise.all(
      topDishesData.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
          include: { category: true },
        })
        return {
          name: menuItem?.name || "Unknown",
          orders: item._sum.quantity || 0,
          revenue: Number(item._sum.price) || 0,
          category: menuItem?.category.name || "Unknown",
        }
      }),
    )

    // Get revenue chart data (last 7 days)
    const revenueChart = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayData = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
        _count: { id: true },
        _sum: { totalAmount: true },
      })

      revenueChart.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: Number(dayData._sum.totalAmount) || 0,
        orders: dayData._count.id || 0,
      })
    }

    // Get category stats
    const categoryData = await prisma.category.findMany({
      include: {
        menuItems: {
          include: {
            orderItems: {
              select: {
                quantity: true,
                price: true,
              },
            },
          },
        },
      },
    })

    const totalRevenue = categoryData.reduce((sum, category) => {
      const categoryRevenue = category.menuItems.reduce((catSum, item) => {
        return (
          catSum +
          item.orderItems.reduce((itemSum, orderItem) => {
            return itemSum + Number(orderItem.price) * orderItem.quantity
          }, 0)
        )
      }, 0)
      return sum + categoryRevenue
    }, 0)

    const categoryStats = categoryData
      .map((category) => {
        const categoryRevenue = category.menuItems.reduce((catSum, item) => {
          return (
            catSum +
            item.orderItems.reduce((itemSum, orderItem) => {
              return itemSum + Number(orderItem.price) * orderItem.quantity
            }, 0)
          )
        }, 0)
        const categoryOrders = category.menuItems.reduce((catSum, item) => {
          return (
            catSum +
            item.orderItems.reduce((itemSum, orderItem) => {
              return itemSum + orderItem.quantity
            }, 0)
          )
        }, 0)

        return {
          name: category.name,
          revenue: categoryRevenue,
          orders: categoryOrders,
          percentage: totalRevenue > 0 ? (categoryRevenue / totalRevenue) * 100 : 0,
        }
      })
      .filter((cat) => cat.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)

    // Get order status distribution
    const statusData = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    })

    const totalOrders = statusData.reduce((sum, item) => sum + item._count.id, 0)
    const orderStatusDistribution = statusData.map((item) => ({
      status: item.status,
      count: item._count.id,
      percentage: totalOrders > 0 ? (item._count.id / totalOrders) * 100 : 0,
    }))

    return {
      dailyRevenue,
      ordersToday,
      avgOrderValue,
      customerSatisfaction,
      revenueChange,
      ordersChange,
      avgOrderChange,
      satisfactionChange,
      topDishes,
      revenueChart,
      categoryStats,
      orderStatusDistribution,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return {
      dailyRevenue: 0,
      ordersToday: 0,
      avgOrderValue: 0,
      customerSatisfaction: 0,
      revenueChange: 0,
      ordersChange: 0,
      avgOrderChange: 0,
      satisfactionChange: 0,
      topDishes: [],
      revenueChart: [],
      categoryStats: [],
      orderStatusDistribution: [],
    }
  }
}

// =============================================================================
// FILE UPLOAD ACTIONS
// =============================================================================

export async function uploadImageToSupabase(
  file: File,
  folder = "images",
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { url, error } = await uploadFileToStorage(file, "images", filePath)

    if (error) {
      return { success: false, error }
    }

    return { success: true, url: url! }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: "Failed to upload image. Please check your Supabase configuration.",
    }
  }
}
