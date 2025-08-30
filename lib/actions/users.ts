"use server"

import { prisma } from "@/lib/prisma"

export async function createUser(data: {
  email: string
  name?: string
  phone?: string
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: true, data: existingUser }
    }

    const user = await prisma.user.create({
      data,
    })
    return { success: true, data: user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return { success: true, data: user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string
    phone?: string
  },
) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    })
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}
