import { Suspense } from "react"
import { getMenuItems, getMenuCategories } from "@/lib/actions/menu"
import MenuClient from "./menu-client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

async function MenuPage() {
  const [rawMenuItems, rawCategories] = await Promise.all([
    getMenuItems(), 
    getMenuCategories()
  ])

  // Transform the data to match client component expectations
  const menuItems = rawMenuItems.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: typeof item.price === 'object' ? Number(item.price) : item.price, // Convert Decimal to number
    imageUrl: item.imageUrl,
    available: item.available,
    category: {
      id: item.category.id,
      name: item.category.name
    }
  }))

  const categories = rawCategories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder // Make sure this matches your DB field name
  }))

  return (
    <div className="container pt-20 mx-auto px-4 py-8">
   
      <MenuClient menuItems={menuItems} categories={categories} />
    </div>
  )
}

function MenuLoading() {
  return (
    <div className="container pt-20 mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700">
            <Skeleton className="w-full h-48" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function MenuPageWrapper() {
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuPage />
    </Suspense>
  )
}
