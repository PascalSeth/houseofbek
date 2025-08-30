// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Clock, CheckCircle, Package, AlertCircle } from "lucide-react"
// import type { Order } from "../actions"
// import { updateOrderStatus } from "../actions"
// import { useTransition } from "react"

// interface OrdersTableProps {
//   orders: Order[]
// }

// export function OrdersTable({ orders }: OrdersTableProps) {
//   const [isPending, startTransition] = useTransition()

//   const getStatusIcon = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return <AlertCircle className="w-4 h-4" />
//       case "preparing":
//         return <Clock className="w-4 h-4" />
//       case "ready":
//         return <Package className="w-4 h-4" />
//       case "completed":
//         return <CheckCircle className="w-4 h-4" />
//     }
//   }

//   const getStatusColor = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
//       case "preparing":
//         return "bg-blue-500/20 text-blue-400 border-blue-500/30"
//       case "ready":
//         return "bg-green-500/20 text-green-400 border-green-500/30"
//       case "completed":
//         return "bg-gray-500/20 text-gray-400 border-gray-500/30"
//     }
//   }

//   const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
//     startTransition(async () => {
//       await updateOrderStatus(orderId, newStatus)
//     })
//   }

//   const formatTime = (date: Date) => {
//     return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
//       Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
//       "minute",
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {orders.map((order) => (
//         <div key={order.id} className="bg-slate-700/30 rounded-lg p-4 space-y-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="text-white font-semibold">{order.customerName}</h4>
//               <p className="text-slate-400 text-sm">
//                 {order.id} • {formatTime(order.createdAt)}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-white font-bold">${order.total}</p>
//               <Badge className={`text-xs ${getStatusColor(order.status)}`}>
//                 {getStatusIcon(order.status)}
//                 <span className="ml-1 capitalize">{order.status}</span>
//               </Badge>
//             </div>
//           </div>

//           <div className="text-slate-300 text-sm">{order.items.join(", ")}</div>

//           {order.status !== "completed" && (
//             <div className="flex gap-2">
//               {order.status === "pending" && (
//                 <Button
//                   size="sm"
//                   onClick={() => handleStatusUpdate(order.id, "preparing")}
//                   disabled={isPending}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   Start Preparing
//                 </Button>
//               )}
//               {order.status === "preparing" && (
//                 <Button
//                   size="sm"
//                   onClick={() => handleStatusUpdate(order.id, "ready")}
//                   disabled={isPending}
//                   className="bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   Mark Ready
//                 </Button>
//               )}
//               {order.status === "ready" && (
//                 <Button
//                   size="sm"
//                   onClick={() => handleStatusUpdate(order.id, "completed")}
//                   disabled={isPending}
//                   className="bg-gray-600 hover:bg-gray-700 text-white"
//                 >
//                   Complete Order
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }
