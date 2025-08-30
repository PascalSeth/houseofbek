"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createOrder(data: {
  userId: string
  orderItems: Array<{
    menuItemId: string
    quantity: number
    price: number
    notes?: string
  }>
  orderType: "PICKUP" | "DELIVERY" | "DINE_IN"
  pickupTime?: Date
  specialNotes?: string
}) {
  try {
    const orderNumber = `ORD-${Date.now()}`
    const totalAmount = data.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        orderNumber,
        orderType: data.orderType,
        totalAmount,
        pickupTime: data.pickupTime,
        specialNotes: data.specialNotes,
        orderItems: {
          create: data.orderItems,
        },
      },
      include: {
        orderItems: {
          include: { menuItem: true },
        },
      },
    })

    revalidatePath("/pickup")
    return { success: true, data: order }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: orders }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { success: false, error: "Failed to fetch orders" }
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED",
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
    revalidatePath("/pickup")
    return { success: true, data: order }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Failed to update order status" }
  }
}
