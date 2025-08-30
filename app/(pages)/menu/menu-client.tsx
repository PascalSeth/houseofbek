"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Clock, ChefHat } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  available: boolean
  category: {
    id: string
    name: string
  }
}

interface MenuCategory {
  id: string
  name: string
  description: string | null
  sortOrder: number
}

interface MenuClientProps {
  menuItems: MenuItem[]
  categories: MenuCategory[]
}

export default function MenuClient({ menuItems, categories }: MenuClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Sample data for demonstration
  const sampleItems = [
    {
      id: "1",
      name: "Truffle Risotto",
      description: "Creamy arborio rice with black truffle, parmesan, and wild mushrooms",
      price: 28.50,
      imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
      available: true,
      category: { id: "1", name: "Mains" }
    },
    {
      id: "2", 
      name: "Seared Salmon",
      description: "Atlantic salmon with lemon herb butter, seasonal vegetables, and quinoa",
      price: 32.00,
      imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      available: true,
      category: { id: "1", name: "Mains" }
    },
    {
      id: "3",
      name: "Caesar Salad",
      description: "Crisp romaine, house-made croutons, parmesan, and our signature dressing",
      price: 16.00,
      imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
      available: true,
      category: { id: "2", name: "Salads" }
    },
    {
      id: "4",
      name: "Chocolate Soufflé",
      description: "Warm dark chocolate soufflé with vanilla ice cream and berry coulis",
      price: 14.00,
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
      available: true,
      category: { id: "3", name: "Desserts" }
    },
    {
      id: "5",
      name: "Beef Wellington",
      description: "Premium beef tenderloin wrapped in pastry with mushroom duxelles",
      price: 48.00,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
      available: true,
      category: { id: "1", name: "Mains" }
    },
    {
      id: "6",
      name: "Burrata Caprese",
      description: "Fresh burrata with heirloom tomatoes, basil, and aged balsamic",
      price: 18.00,
      imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop",
      available: true,
      category: { id: "4", name: "Appetizers" }
    }
  ]

  const sampleCategories = [
    { id: "1", name: "Mains", description: "Our signature main courses", sortOrder: 1 },
    { id: "2", name: "Salads", description: "Fresh and healthy options", sortOrder: 2 },
    { id: "3", name: "Desserts", description: "Sweet endings", sortOrder: 3 },
    { id: "4", name: "Appetizers", description: "Perfect starters", sortOrder: 0 }
  ]

  const displayItems = menuItems.length > 0 ? menuItems : sampleItems
  const displayCategories = categories.length > 0 ? categories : sampleCategories

  const categoryOptions = [
    { id: "all", name: "All", description: null, sortOrder: -1 },
    ...displayCategories.sort((a, b) => a.sortOrder - b.sortOrder),
  ]

  const filteredItems =
    selectedCategory === "All"
      ? displayItems.filter((item) => item.available)
      : displayItems.filter((item) => item.category.name === selectedCategory && item.available)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Professional Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-6">
            <ChefHat className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">Fine Dining Experience</span>
          </div> */}
          
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Our
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent font-medium">
              Menu
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Carefully crafted dishes using the finest seasonal ingredients, prepared by our award-winning culinary team.
          </p>

          {/* Clean Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryOptions.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm
                  ${selectedCategory === category.name 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm" 
                    : "text-slate-300 hover:text-white border border-slate-600/50 hover:border-purple-400/50 hover:bg-slate-800/50"
                  }
                `}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-purple-400/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Professional badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.price > 30 && (
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-full px-3 py-1 flex items-center gap-1 text-xs font-medium backdrop-blur-sm shadow-sm">
                      <Award className="w-3 h-3" />
                      Signature
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-white text-xs font-medium">4.8</span>
                </div>
              </div>

              <CardHeader className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-xl font-semibold text-white leading-tight">
                    {item.name}
                  </CardTitle>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-purple-300">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <CardDescription className="text-slate-300 leading-relaxed text-sm mb-4">
                  {item.description || "A delicious dish prepared with the finest ingredients"}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="border-purple-400/30 text-purple-300 bg-purple-500/10"
                  >
                    {item.category.name}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3 h-3" />
                    15-20 min
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No items available</h3>
              <p className="text-slate-300 leading-relaxed">
                We couldn't find any items in this category. Please try selecting a different category.
              </p>
            </div>
          </div>
        )}

        {/* Professional Footer Info */}
        <div className="mt-20 pt-12 border-t border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="font-semibold text-white mb-2">Chef's Special</h3>
              <p className="text-sm text-slate-300">Daily selections featuring seasonal ingredients</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="font-semibold text-white mb-2">Award Winning</h3>
              <p className="text-sm text-slate-300">Recognized for culinary excellence</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="font-semibold text-white mb-2">Premium Quality</h3>
              <p className="text-sm text-slate-300">Sourced from local organic farms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}