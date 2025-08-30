import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, Calendar, Star } from "lucide-react"
import type { DashboardStats } from "../actions"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: Package,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: `+${stats.ordersToday} today`,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: `+$${stats.revenueToday} today`,
    },
    {
      title: "Active Reservations",
      value: stats.activeReservations.toString(),
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: "Next 24 hours",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toString(),
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      change: "Last 30 days",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
