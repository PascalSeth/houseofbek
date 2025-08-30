// import { getOrders } from "@/app/dashboard/actions"
// import { OrdersTable } from "@/app/dashboard/components/orders-table"

// export default async function OrdersPage() {
//   const orders = await getOrders()

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-white">Orders Management</h1>
//         <p className="text-slate-400 mt-2">Manage and track all restaurant orders</p>
//       </div>

//       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
//         <OrdersTable orders={orders} />
//       </div>
//     </div>
//   )
// }
import React from 'react'

type Props = {}

function page({}: Props) {
  return (
    <div>page</div>
  )
}

export default page