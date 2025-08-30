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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ChefHat, Clock, DollarSign, ImageIcon, Filter } from "lucide-react"
import { createMenuItem, updateMenuItem, deleteMenuItem, uploadImageToSupabase } from "../actions"
import { useRouter } from "next/navigation"

type MenuItemWithCategory = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  available: boolean
  categoryId: string
  preparationTime: number | null
  category: {
    id: string
    name: string
    description: string | null
    imageUrl: string | null
    sortOrder: number
  }
}

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

interface MenuTableProps {
  menuItems: MenuItemWithCategory[]
  categories: CategoryWithCount[]
}

export function MenuTable({ menuItems, categories }: MenuTableProps) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItemWithCategory | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Added file state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    preparationTime: "",
    available: true,
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: "",
      preparationTime: "",
      available: true,
    })
    setEditingItem(null)
    setSelectedFile(null) // Reset file state
  }

  const handleOpenDialog = (item?: MenuItemWithCategory) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        imageUrl: item.imageUrl || "",
        categoryId: item.categoryId,
        preparationTime: item.preparationTime?.toString() || "",
        available: item.available,
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
          const uploadResult = await uploadImageToSupabase(selectedFile, "menu")
          if (uploadResult.success && uploadResult.url) {
            imageUrl = uploadResult.url
          } else {
            console.error("Error uploading image:", uploadResult.error)
            return
          }
        }

        const data = {
          name: formData.name,
          description: formData.description || undefined,
          price: Number.parseFloat(formData.price),
          imageUrl: imageUrl || undefined,
          categoryId: formData.categoryId,
          preparationTime: formData.preparationTime ? Number.parseInt(formData.preparationTime) : undefined,
          available: formData.available,
        }

        let result
        if (editingItem) {
          result = await updateMenuItem(editingItem.id, data)
        } else {
          result = await createMenuItem(data)
        }

        if (result.success) {
          handleCloseDialog()
          router.refresh()
        } else {
          console.error("Error saving menu item:", result.error)
        }
      } catch (error) {
        console.error("Error saving menu item:", error)
      }
    })
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item? This action cannot be undone.")) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteMenuItem(itemId)
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || "Failed to delete menu item")
        }
      } catch (error) {
        console.error("Error deleting menu item:", error)
        alert("Failed to delete menu item")
      }
    })
  }

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.categoryId === selectedCategory)

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No menu items found</h3>
        <p className="text-slate-400 mb-6">Create your first menu item to get started.</p>
        {categories.length === 0 ? (
          <p className="text-yellow-400 mb-4">You need to create categories first before adding menu items.</p>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Menu Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="price" className="text-slate-300">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-slate-300">
                      Category
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-white">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="preparationTime" className="text-slate-300">
                      Prep Time (minutes)
                    </Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      min="0"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image" className="text-slate-300">
                    Menu Item Image
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available" className="text-slate-300">
                    Available
                  </Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                  >
                    {isPending ? "Saving..." : "Add Menu Item"}
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
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">All Menu Items</h2>
          <p className="text-slate-400 text-sm">
            {filteredItems.length} of {menuItems.length} items
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {categories.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="price" className="text-slate-300">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-slate-300">
                        Category
                      </Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="text-white">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preparationTime" className="text-slate-300">
                        Prep Time (minutes)
                      </Label>
                      <Input
                        id="preparationTime"
                        type="number"
                        min="0"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-slate-300">
                      Menu Item Image
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                    />
                    <Label htmlFor="available" className="text-slate-300">
                      Available
                    </Label>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                    >
                      {isPending ? "Saving..." : editingItem ? "Update Menu Item" : "Add Menu Item"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      className="border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-400" />
                    )}
                    <div>
                      {item.name}
                      <div className="text-sm font-normal text-slate-400">{item.category.name}</div>
                    </div>
                  </CardTitle>
                  {item.description && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.description}</p>}
                </div>
                <Badge
                  variant={item.available ? "default" : "secondary"}
                  className={item.available ? "bg-green-600" : "bg-slate-600"}
                >
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">${item.price}</span>
                </div>
                {item.preparationTime && (
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>{item.preparationTime}min</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(item)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
