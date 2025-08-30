// reservations-table.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Clock, MessageSquare, MapPin } from "lucide-react"
import { updateReservationStatus } from "../actions"
import { useTransition } from "react"
import { ReservationStatus } from "@prisma/client"

// Type based on your Prisma schema
type ReservationWithRelations = {
  id: string
  userId: string
  tableId: string
  date: Date
  time: Date
  partySize: number
  status: ReservationStatus
  specialNotes: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    email: string
    name: string | null
    phone: string | null
  }
  table: {
    id: string
    number: number
    capacity: number
    location: string | null
    available: boolean
  }
}

interface ReservationsTableProps {
  reservations: ReservationWithRelations[]
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [isPending, startTransition] = useTransition()

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "CONFIRMED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "SEATED":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "COMPLETED":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleStatusUpdate = (reservationId: string, newStatus: ReservationStatus) => {
    startTransition(async () => {
      const result = await updateReservationStatus(reservationId, newStatus)
      if (!result.success) {
        console.error('Failed to update reservation status:', result.error)
        // You might want to show a toast notification here
      }
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString()
    }
  }

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No reservations found</h3>
        <p className="text-slate-400">Reservations will appear here when customers make bookings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="bg-slate-700/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">
                {reservation.user.name || reservation.user.email}
              </h4>
              <div className="flex items-center gap-4 text-slate-400 text-sm mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {reservation.partySize} guests
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(reservation.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(reservation.time)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Table {reservation.table.number}
                  {reservation.table.location && ` (${reservation.table.location})`}
                </span>
              </div>
              {reservation.user.phone && (
                <div className="text-slate-400 text-sm mt-1">
                  Phone: {reservation.user.phone}
                </div>
              )}
            </div>
            <Badge className={`text-xs ${getStatusColor(reservation.status)}`}>
              <span className="capitalize">{reservation.status.toLowerCase()}</span>
            </Badge>
          </div>

          {reservation.specialNotes && (
            <div className="flex items-start gap-2 text-slate-300 text-sm bg-slate-800/50 rounded p-2">
              <MessageSquare className="w-4 h-4 mt-0.5 text-slate-400" />
              <span>{reservation.specialNotes}</span>
            </div>
          )}

          <div className="flex gap-2">
            {reservation.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(reservation.id, "CONFIRMED")}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(reservation.id, "CANCELLED")}
                  disabled={isPending}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  Cancel
                </Button>
              </>
            )}

            {reservation.status === "CONFIRMED" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(reservation.id, "SEATED")}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Seat Guests
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(reservation.id, "CANCELLED")}
                  disabled={isPending}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  Cancel
                </Button>
              </>
            )}

            {reservation.status === "SEATED" && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(reservation.id, "COMPLETED")}
                disabled={isPending}
                className="bg-slate-600 hover:bg-slate-700 text-white"
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
