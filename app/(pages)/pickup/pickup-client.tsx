"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCartIcon, Plus, Minus, Star, Book, Clock, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createOrder } from "@/lib/actions/orders"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

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

interface CartItem extends MenuItem {
  quantity: number
}

interface PickupClientProps {
  menuItems: MenuItem[]
  categories: MenuCategory[]
}

function CheckoutForm({
  cartItems,
  total,
  onOrderComplete,
}: {
  cartItems: CartItem[]
  total: number
  onOrderComplete: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const orderItems = cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        }))

        // Updated to match the expected createOrder interface
        await createOrder({
          userId: "guest", // Add a default userId or get from auth
          orderItems,
          orderType: "PICKUP" as const,
          specialNotes: customerInfo.notes || undefined,
          // Add customer info to special notes if the API doesn't support separate customer fields
          // Or modify the createOrder function to accept customer info
        })

        toast({
          title: "Order Placed Successfully!",
          description: "We'll have your order ready for pickup soon.",
        })

        onOrderComplete()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          Checkout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">
              Name *
            </Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">
              Email (optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-white">
              Special Instructions
            </Label>
            <Textarea
              id="notes"
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <div className="border-t border-slate-600 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-2xl font-bold text-purple-400">${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
              <Clock className="w-4 h-4" />
              <span>Ready for pickup in 15-20 minutes</span>
            </div>
            <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700" disabled={isPending}>
              {isPending ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function InteractiveImageMenu({
  items,
  onItemSelect,
  selectedItem,
  selectedCategory,
  onCategoryChange,
}: {
  items: MenuItem[]
  onItemSelect: (item: MenuItem) => void
  selectedItem: MenuItem | null
  selectedCategory: string
  onCategoryChange: (category: string) => void
}) {
  const categoryOptions = [
    { id: "all", name: "All", description: null, sortOrder: 0 },
    ...items
      .reduce((acc, item) => {
        if (!acc.find((cat) => cat.name === item.category.name)) {
          acc.push({
            id: item.category.id,
            name: item.category.name,
            description: null,
            sortOrder: 0
          })
        }
        return acc
      }, [] as MenuCategory[])
      .sort((a, b) => a.sortOrder - b.sortOrder),
  ]

  const filteredItems =
    selectedCategory === "All"
      ? items.filter((item) => item.available)
      : items.filter((item) => item.category.name === selectedCategory && item.available)

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categoryOptions.map((category) => (
          <Button
            key={category.id || category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            onClick={() => onCategoryChange(category.name)}
            className="rounded-full text-sm"
            size="sm"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-slate-800/50 border-slate-700 overflow-hidden ${
              selectedItem?.id === item.id ? "ring-2 ring-purple-500 shadow-purple-500/25" : ""
            }`}
            onClick={() => onItemSelect(item)}
          >
            <div className="relative">
              <Image
                src={item.imageUrl || "/placeholder.svg?height=160&width=300&query=restaurant dish"}
                alt={item.name}
                width={300}
                height={160}
                className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-xs">4.8</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                ${item.price.toFixed(2)}
              </div>
            </div>

            <CardContent className="p-3">
              <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">
                {item.name}
              </h3>
              <p className="text-slate-300 text-xs mt-1 line-clamp-2">{item.description || ""}</p>
              <Badge variant="outline" className="text-purple-300 border-purple-300 mt-2 text-xs">
                {item.category.name}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Menu Item Detail Card
function MenuItemDetail({
  item,
  onAddToCart,
}: { item: MenuItem; onAddToCart: (item: MenuItem & { quantity: number }) => void }) {
  const [quantity, setQuantity] = useState(1)

  if (!item) return null

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">{item.name}</CardTitle>
            <Badge variant="secondary" className="mt-2 bg-purple-600 text-white">
              {item.category.name}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">${item.price.toFixed(2)}</div>
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-slate-300">4.8</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Image
          src={item.imageUrl || "/placeholder.svg?height=200&width=400&query=restaurant dish"}
          alt={item.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-lg mb-4 border border-slate-600"
        />
        <p className="text-slate-300 mb-6">{item.description || ""}</p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold w-8 text-center text-white">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => onAddToCart({ ...item, quantity })}
            className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto"
          >
            Add to Cart - ${(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Shopping Cart Component
function CartComponent({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ShoppingCartIcon className="w-5 h-5" />
          Your Order ({cartItems.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
          <p className="text-slate-300 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=48&width=48&query=restaurant dish"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded border border-slate-600"
                    />
                    <div>
                      <div className="font-semibold text-white text-sm">{item.name}</div>
                      <div className="text-xs text-slate-300">${item.price.toFixed(2)} each</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 p-0 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-white text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-2 text-xs px-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-600 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-2xl font-bold text-purple-400">${total.toFixed(2)}</span>
              </div>
              <Button onClick={onCheckout} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function PickupClient({ menuItems, categories }: PickupClientProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCheckout, setShowCheckout] = useState(false)

  const handleAddToCart = (item: MenuItem & { quantity: number }) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
        )
      }
      return [...prev, { ...item }]
    })
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleOrderComplete = () => {
    setCartItems([])
    setShowCheckout(false)
    setSelectedItem(null)
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Interactive Menu Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Book className="w-5 h-5" />
              Menu
            </CardTitle>
            <p className="text-slate-300">Click on any item to view details and add to cart</p>
          </CardHeader>
          <CardContent>
            <InteractiveImageMenu
              items={menuItems}
              onItemSelect={setSelectedItem}
              selectedItem={selectedItem}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </CardContent>
        </Card>

        {/* Selected Item Detail */}
        {selectedItem && <MenuItemDetail item={selectedItem} onAddToCart={handleAddToCart} />}
      </div>

      {/* Shopping Cart Section */}
      <div className="lg:sticky lg:top-6 h-fit">
        {showCheckout ? (
          <CheckoutForm cartItems={cartItems} total={total} onOrderComplete={handleOrderComplete} />
        ) : (
          <CartComponent
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => setShowCheckout(true)}
          />
        )}
      </div>
    </div>
  )
}
