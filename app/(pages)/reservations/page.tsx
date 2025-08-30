import { Suspense } from "react"
import { getTables } from "@/lib/actions/reservations"
import ReservationsClient from "./reservations-client"
import { Skeleton } from "@/components/ui/skeleton"

async function ReservationsPage() {
  const tables = await getTables()

  return <ReservationsClient tables={tables} />
}

function ReservationsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[500px] mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-6">
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReservationsPageWrapper() {
  return (
    <Suspense fallback={<ReservationsLoading />}>
      <ReservationsPage />
    </Suspense>
  )
}
