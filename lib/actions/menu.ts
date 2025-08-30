"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { available: true },
      include: {
        category: true,
      },
      orderBy: { name: "asc" },
    })
    console.log("Menu items fetched:",menuItems, menuItems.length)
    return menuItems
  } catch (error) {
    console.error("Error fetching menu items:", error)
    throw new Error("Failed to fetch menu items")
  }
}

export async function getMenuCategories() {
  try {
    const categories = await prisma.category.findMany({
    })
    return categories
  } catch (error) {
    console.error("Error fetching menu categories:", error)
    throw new Error("Failed to fetch menu categories")
  }
}

export async function getMenuItem(id: string) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    })
    return { success: true, data: menuItem }
  } catch (error) {
    console.error("Error fetching menu item:", error)
    return { success: false, error: "Failed to fetch menu item" }
  }
}

export async function createMenuItem(data: {
  name: string
  description?: string
  price: number
  categoryId: string
  imageUrl?: string
}) {
  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        ...data,
        price: data.price,
      },
    })
    revalidatePath("/menu")
    return { success: true, data: menuItem }
  } catch (error) {
    console.error("Error creating menu item:", error)
    return { success: false, error: "Failed to create menu item" }
  }
}
