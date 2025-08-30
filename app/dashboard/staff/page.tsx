import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function StaffPage() {
  const staff = [
    { id: 1, name: "Alex Chen", role: "Head Chef", status: "active", shift: "Morning" },
    { id: 2, name: "Maria Rodriguez", role: "Sous Chef", status: "active", shift: "Evening" },
    { id: 3, name: "James Wilson", role: "Server", status: "break", shift: "Morning" },
    { id: 4, name: "Sarah Kim", role: "Bartender", status: "active", shift: "Evening" },
    { id: 5, name: "David Brown", role: "Host", status: "off", shift: "Night" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Staff Management</h1>
        <p className="text-slate-400 mt-2">Monitor staff schedules and status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                <Badge
                  variant={member.status === "active" ? "default" : member.status === "break" ? "secondary" : "outline"}
                  className={
                    member.status === "active"
                      ? "bg-green-600 hover:bg-green-700"
                      : member.status === "break"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-slate-300">
                <p className="font-medium">{member.role}</p>
                <p className="text-sm text-slate-400">{member.shift} Shift</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Schedule
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
