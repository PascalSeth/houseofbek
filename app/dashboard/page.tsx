import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, Calendar, Users, Package, Star } from "lucide-react"
import { StatsCards } from "./components/stats-cards"
import { OrdersTable } from "./components/orders-table"
import { ReservationsTable } from "./components/reservations-table"
import { getDashboardStats, getRecentOrders, getUpcomingReservations } from "./actions"

export default async function DashboardPage() {
  const [stats, recentOrders, upcomingReservations] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getUpcomingReservations(),
  ])

  return (
    <div className="  ">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-black text-white">Dashboard Overview</h1>
          <p className="text-lg text-slate-300">Real-time insights for House of Bek</p>
        </div>

        {/* Stats Cards */}
        <Suspense fallback={<div className="text-white">Loading stats...</div>}>
          <StatsCards stats={stats} />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-purple-400" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-slate-300">Loading orders...</div>}>
                <OrdersTable orders={recentOrders} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Upcoming Reservations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Upcoming Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-slate-300">Loading reservations...</div>}>
                <ReservationsTable reservations={upcomingReservations} />

              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Package className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Add Reservation
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                Manage Staff
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Star className="w-4 h-4 mr-2" />
                View Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
