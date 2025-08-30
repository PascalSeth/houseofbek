"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Calendar, Clock, Users } from "lucide-react"
import { createEventBooking } from "@/lib/actions/events"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Event {
  id: string
  title: string
  description: string | null
  date: Date
  startTime: string
  endTime: string
  maxAttendees: number
  price: number
  status: string
  imageUrl: string | null
}

interface EventBookingData {
  eventId: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  attendees: number
  specialRequests: string
}

interface EventsClientProps {
  events: Event[]
}

// Event Detail Card
function EventDetailCard({ event }: { event: Event }) {
  if (!event) return null

  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 h-fit border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">{event.title}</CardTitle>
              <Badge variant="secondary" className="mt-1 bg-purple-600 text-white">
                Up to {event.maxAttendees} attendees
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">${event.price}</div>
            <div className="text-sm text-slate-300">Per person</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Image
          src={event.imageUrl || "/placeholder.svg?height=200&width=400&query=special event"}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-lg mb-4 border border-slate-600"
        />
        <p className="text-slate-300 mb-4">{event.description || ""}</p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar className="w-4 h-4 text-purple-400" />
              {eventDate.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-purple-400" />
              {event.startTime} - {event.endTime}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users className="w-4 h-4 text-purple-400" />
              Max {event.maxAttendees} attendees
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={isUpcoming ? "default" : "secondary"} className="bg-purple-600 text-white">
                {event.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Event Booking Form
function EventBookingForm({
  bookingData,
  onUpdate,
  onSubmit,
  selectedEvent,
  isPending,
}: {
  bookingData: EventBookingData
  onUpdate: (data: Partial<EventBookingData>) => void
  onSubmit: () => void
  selectedEvent: Event | null
  isPending: boolean
}) {
  const calculateTotal = () => {
    if (!selectedEvent) return 0
    return selectedEvent.price * bookingData.attendees
  }

  const isComplete =
    bookingData.eventId && bookingData.customerName && bookingData.customerEmail && bookingData.attendees > 0

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Event Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Event Info */}
        {selectedEvent && (
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
            <h4 className="font-semibold text-white mb-2">Selected Event</h4>
            <div className="text-sm text-slate-300">
              <div>{selectedEvent.title}</div>
              <div>
                {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.startTime}
              </div>
            </div>
          </div>
        )}

        {/* Number of Attendees */}
        <div>
          <Label htmlFor="attendees" className="text-white">
            Number of Attendees
          </Label>
          <Input
            id="attendees"
            type="number"
            value={bookingData.attendees}
            onChange={(e) => onUpdate({ attendees: Number.parseInt(e.target.value) || 0 })}
            min="1"
            max={selectedEvent?.maxAttendees || 100}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Contact Information</h4>
          <div>
            <Label htmlFor="name" className="text-white">
              Full Name *
            </Label>
            <Input
              id="name"
              value={bookingData.customerName}
              onChange={(e) => onUpdate({ customerName: e.target.value })}
              placeholder="Enter your full name"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => onUpdate({ customerEmail: e.target.value })}
                placeholder="your@email.com"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone
              </Label>
              <Input
                id="phone"
                value={bookingData.customerPhone}
                onChange={(e) => onUpdate({ customerPhone: e.target.value })}
                placeholder="(555) 123-4567"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <Label htmlFor="requests" className="text-white">
            Special Requests
          </Label>
          <Textarea
            id="requests"
            value={bookingData.specialRequests}
            onChange={(e) => onUpdate({ specialRequests: e.target.value })}
            placeholder="Any special requirements, dietary restrictions, or custom requests..."
            rows={3}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {/* Total and Submit */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-white">Total Cost:</span>
            <span className="text-2xl font-bold text-purple-400">${calculateTotal().toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Final pricing will be confirmed after consultation with our event coordinator.
          </p>
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
            disabled={!isComplete || isPending}
            onClick={onSubmit}
          >
            {isPending ? "Booking Event..." : "Book Event"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Confirmation Component
function EventConfirmation({
  bookingData,
  selectedEvent,
  onNewBooking,
}: {
  bookingData: EventBookingData
  selectedEvent: Event | null
  onNewBooking: () => void
}) {
  return (
    <div className="text-center space-y-6">
      <div className="animate-float">
        <CheckCircle className="w-24 h-24 text-purple-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl font-bold text-white mb-2">Event Booking Confirmed!</h2>
        <p className="text-slate-300">You will receive a confirmation email shortly</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-white">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Event:</span>
            <span className="text-white font-semibold">{selectedEvent?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date:</span>
            <span className="text-white font-semibold">
              {selectedEvent ? new Date(selectedEvent.date).toLocaleDateString() : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Time:</span>
            <span className="text-white font-semibold">{selectedEvent?.startTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Attendees:</span>
            <span className="text-white font-semibold">{bookingData.attendees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Contact:</span>
            <span className="text-white font-semibold">{bookingData.customerName}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onNewBooking} className="bg-purple-600 text-white hover:bg-purple-700">
          Book Another Event
        </Button>
      </div>
    </div>
  )
}

function EventGrid({
  onEventSelect,
  selectedEvent,
  events,
}: { onEventSelect: (event: Event) => void; selectedEvent: Event | null; events: Event[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => {
        const isSelected = selectedEvent?.id === event.id
        const eventDate = new Date(event.date)
        const isUpcoming = eventDate > new Date()

        return (
          <Card
            key={event.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-slate-800/50 border-2 ${
              isSelected
                ? "border-purple-500 shadow-lg shadow-purple-500/20 bg-purple-500/5"
                : "border-slate-700 hover:border-purple-500/50"
            }`}
            onClick={() => onEventSelect(event)}
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={event.imageUrl || "/placeholder.svg?height=200&width=400&query=special event"}
                alt={event.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    Up to {event.maxAttendees} attendees
                  </Badge>
                </div>
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-sm opacity-90">${event.price} per person</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-slate-300 text-sm mb-3 line-clamp-2">{event.description || ""}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {eventDate.toLocaleDateString()}
                </div>
                <Badge variant={isUpcoming ? "default" : "secondary"} className="text-xs bg-purple-600 text-white">
                  {event.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function EventsClient({ events }: EventsClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<EventBookingData>({
    eventId: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    attendees: 1,
    specialRequests: "",
  })

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event)
    setBookingData((prev) => ({ ...prev, eventId: event.id }))
  }

  const handleBookingUpdate = (data: Partial<EventBookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmitBooking = () => {
    if (!selectedEvent) return

    startTransition(async () => {
      try {
        // Map the attendees field to the expected partySize field
        await createEventBooking({
          eventId: bookingData.eventId!,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone || undefined,
          partySize: bookingData.attendees, // Map attendees to partySize
          specialNotes: bookingData.specialRequests || undefined, // Map specialRequests to specialNotes
        })

        toast({
          title: "Event Booked Successfully!",
          description: "You will receive a confirmation email shortly.",
        })

        setIsConfirmed(true)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to book event. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleNewBooking = () => {
    setIsConfirmed(false)
    setSelectedEvent(null)
    setBookingData({
      eventId: null,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      attendees: 1,
      specialRequests: "",
    })
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <EventConfirmation bookingData={bookingData} selectedEvent={selectedEvent} onNewBooking={handleNewBooking} />
      </div>
    )
  }

  return (
    <div className="lg:sticky lg:top-6">
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Choose Your Event</CardTitle>
            <p className="text-slate-300">Click on any event card to explore options and start booking</p>
          </CardHeader>
          <CardContent>
            <EventGrid onEventSelect={handleEventSelect} selectedEvent={selectedEvent} events={events} />
          </CardContent>
        </Card>

        {/* Right Column - Booking Form */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <EventBookingForm
            bookingData={bookingData}
            onUpdate={handleBookingUpdate}
            onSubmit={handleSubmitBooking}
            selectedEvent={selectedEvent}
            isPending={isPending}
          />

          {selectedEvent && <EventDetailCard event={selectedEvent} />}
        </div>
      </div>
    </div>
  )
}
