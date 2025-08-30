import { Suspense } from "react"
import { getMenuItems, getMenuCategories } from "@/lib/actions/menu"
import PickupClient from "./pickup-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Book } from "lucide-react"

async function PickupPage() {
  const [dbMenuItems, dbCategories] = await Promise.all([getMenuItems(), getMenuCategories()])
  
  // Transform the data inline to match the expected types
  const menuItems = dbMenuItems.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price), // Convert Decimal to number
    imageUrl: item.imageUrl,
    available: item.available,
    category: {
      id: item.category.id,
      name: item.category.name,
    },
  }))

  const categories = dbCategories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
  }))

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="ml-0 lg:ml-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Order Pickup</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Browse our menu and place your order for pickup</p>
          </div>
          <PickupClient menuItems={menuItems} categories={categories} />
        </div>
      </div>
    </div>
  )
}

function PickupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="ml-0 lg:ml-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Menu
                  </CardTitle>
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="bg-slate-800/50 border-slate-700">
                        <Skeleton className="w-full h-32 sm:h-40" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:sticky lg:top-6 h-fit">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PickupPageWrapper() {
  return (
    <Suspense fallback={<PickupLoading />}>
      <PickupPage />
    </Suspense>
  )
}
