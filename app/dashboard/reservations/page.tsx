import { getReservations } from "@/app/dashboard/actions"
import { ReservationsTable } from "@/app/dashboard/components/reservations-table"

export default async function ReservationsPage() {
  const result = await getReservations()
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Reservations Management</h1>
          <p className="text-slate-400 mt-2">View and manage table reservations</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Error loading reservations</div>
            <p className="text-slate-400 text-sm">{result.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reservations Management</h1>
        <p className="text-slate-400 mt-2">View and manage table reservations</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <ReservationsTable reservations={result.data} />
      </div>
    </div>
  )
}
