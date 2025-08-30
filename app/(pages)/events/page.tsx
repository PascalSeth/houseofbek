import { Suspense } from "react"
import { getEvents } from "@/lib/actions/events"
import EventsClient from "./events-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

async function EventsPage() {
  const dbEventsResult = await getEvents()

  // Handle the response structure properly
  if (!dbEventsResult.success || !dbEventsResult.data) {
    return (
      <div className="min-h-screen pt-10 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error Loading Events</h1>
          <p className="text-slate-300">{dbEventsResult.error || "Unable to load events at this time"}</p>
        </div>
      </div>
    )
  }

  // Transform the data inline to match the expected types
  const events = dbEventsResult.data.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    startTime:
      event.startTime instanceof Date
        ? event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : event.startTime,
    endTime:
      event.endTime instanceof Date
        ? event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : event.endTime,
    maxAttendees: event.capacity || event.maxAttendees || 0,
    price: Number(event.price) || 0, // Convert Decimal to number if needed
    status: event.available ? "Available" : "Unavailable",
    imageUrl: event.imageUrl,
  }))

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Special Events</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Create unforgettable memories with our premium event hosting services
          </p>
        </div>
        <EventsClient events={events} />
      </div>
    </div>
  )
}

function EventsLoading() {
  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 border-slate-700">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-slate-700">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="bg-card border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="bg-card border-slate-700">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventsPageWrapper() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <EventsPage />
    </Suspense>
  )
}
