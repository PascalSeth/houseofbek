"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Package, ImageIcon } from "lucide-react"
import { createCategory, updateCategory, deleteCategory, uploadImageToSupabase } from "../actions"
import { useRouter } from "next/navigation"

type CategoryWithCount = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
  _count: {
    menuItems: number
  }
}

interface CategoriesTableProps {
  categories: CategoryWithCount[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Added file state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      sortOrder: 0,
    })
    setEditingCategory(null)
    setSelectedFile(null) // Reset file state
  }

  const handleOpenDialog = (category?: CategoryWithCount) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        sortOrder: category.sortOrder,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        let imageUrl = formData.imageUrl

        if (selectedFile) {
          const uploadResult = await uploadImageToSupabase(selectedFile, "categories")
          if (uploadResult.success && uploadResult.url) {
            imageUrl = uploadResult.url
          } else {
            console.error("Error uploading image:", uploadResult.error)
            return
          }
        }

        let result
        if (editingCategory) {
          result = await updateCategory(editingCategory.id, {
            name: formData.name,
            description: formData.description || undefined,
            imageUrl: imageUrl || undefined,
            sortOrder: formData.sortOrder,
          })
        } else {
          result = await createCategory({
            name: formData.name,
            description: formData.description || undefined,
            imageUrl: imageUrl || undefined,
            sortOrder: formData.sortOrder,
          })
        }

        if (result.success) {
          handleCloseDialog()
          router.refresh()
        } else {
          console.error("Error saving category:", result.error)
        }
      } catch (error) {
        console.error("Error saving category:", error)
      }
    })
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteCategory(categoryId)
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || "Failed to delete category")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category")
      }
    })
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
        <p className="text-slate-400 mb-6">Create your first category to organize your menu items.</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-slate-300">
                  Category Image
                </Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                  />
                  <div className="text-xs text-slate-400">Or provide an image URL:</div>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sortOrder" className="text-slate-300">
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number.parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                >
                  {isPending ? "Saving..." : "Add Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">All Categories</h2>
          <p className="text-slate-400 text-sm">{categories.length} categories total</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-slate-300">
                  Category Image
                </Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                  />
                  <div className="text-xs text-slate-400">Or provide an image URL:</div>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sortOrder" className="text-slate-300">
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number.parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                >
                  {isPending ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl || "/placeholder.svg"}
                        alt={category.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                    {category.name}
                  </CardTitle>
                  {category.description && <p className="text-slate-400 text-sm mt-1">{category.description}</p>}
                </div>
                <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                  Order: {category.sortOrder}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <Package className="w-4 h-4" />
                <span className="text-sm">
                  {category._count.menuItems} menu item{category._count.menuItems !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(category)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(category.id)}
                  disabled={isPending || category._count.menuItems > 0}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              {category._count.menuItems > 0 && (
                <p className="text-xs text-yellow-400">Cannot delete: category has menu items</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
