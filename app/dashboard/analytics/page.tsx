import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAnalyticsData } from "../actions"
import { AnalyticsCharts } from "../components/analytics-charts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Star } from "lucide-react"

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData()

  const metrics = [
    {
      title: "Daily Revenue",
      value: `$${analytics.dailyRevenue.toLocaleString()}`,
      change: `${analytics.revenueChange >= 0 ? "+" : ""}${analytics.revenueChange.toFixed(1)}%`,
      trend: analytics.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Orders Today",
      value: analytics.ordersToday.toString(),
      change: `${analytics.ordersChange >= 0 ? "+" : ""}${analytics.ordersChange.toFixed(1)}%`,
      trend: analytics.ordersChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Avg Order Value",
      value: `$${analytics.avgOrderValue.toFixed(2)}`,
      change: `${analytics.avgOrderChange >= 0 ? "+" : ""}${analytics.avgOrderChange.toFixed(1)}%`,
      trend: analytics.avgOrderChange >= 0 ? "up" : "down",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Customer Satisfaction",
      value: `${analytics.customerSatisfaction}/5`,
      change: `${analytics.satisfactionChange >= 0 ? "+" : ""}${analytics.satisfactionChange.toFixed(1)}`,
      trend: analytics.satisfactionChange >= 0 ? "up" : "down",
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-2">Track performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card
              key={metric.title}
              className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-3 h-3 ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`} />
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      metric.trend === "up"
                        ? "text-green-400 border-green-400/30 bg-green-400/10"
                        : "text-red-400 border-red-400/30 bg-red-400/10"
                    }`}
                  >
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-slate-400 ml-1">vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <AnalyticsCharts analytics={analytics} />

      {/* Top Dishes and Category Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Dishes</CardTitle>
            <p className="text-slate-400 text-sm">Most ordered items this period</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topDishes.length > 0 ? (
                analytics.topDishes.map((dish, index) => (
                  <div
                    key={dish.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{dish.name}</p>
                        <p className="text-slate-400 text-sm">
                          {dish.orders} orders • {dish.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${dish.revenue.toLocaleString()}</p>
                      <p className="text-slate-400 text-xs">revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No order data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Category Performance</CardTitle>
            <p className="text-slate-400 text-sm">Revenue by menu category</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryStats.length > 0 ? (
                analytics.categoryStats.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{category.name}</p>
                        <p className="text-slate-400 text-sm">{category.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${category.revenue.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No category data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
