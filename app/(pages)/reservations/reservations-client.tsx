// "use client"

// import { Suspense, useState, useRef, useTransition } from "react"
// import { Canvas, useFrame } from "@react-three/fiber"
// import * as THREE from "three"
// import { createReservation } from "@/lib/actions/reservations"
// import { useToast } from "@/hooks/use-toast"

// interface TableType {
//   id: string
//   number: number
//   capacity: number
//   location: string
//   position: [number, number, number]
//   color: string
//   emoji: string
//   shape: "round" | "square" | "rectangular"
// }

// interface CustomerInfo {
//   name: string
//   email: string
//   phone: string
//   requests: string
// }

// interface AnimatedTableProps {
//   table: TableType
//   isSelected: boolean
//   isHovered: boolean
//   onClick: (table: TableType) => void
//   onHover: (id: string) => void
//   onUnhover: () => void
// }

// interface TableSceneProps {
//   onTableSelect: (table: TableType) => void
//   selectedTable: TableType | null
//   tables: TableType[]
// }

// interface CalendarProps {
//   selectedDate: string
//   onDateSelect: (date: string) => void
// }

// interface TimeSlotProps {
//   selectedTime: string
//   onTimeSelect: (time: string) => void
//   selectedDate: string
// }

// interface ReservationsClientProps {
//   tables: Array<{
//     id: string
//     number: number
//     capacity: number
//     location: string
//   }>
// }

// // Available time slots
// const timeSlots = [
//   "5:00 PM",
//   "5:30 PM",
//   "6:00 PM",
//   "6:30 PM",
//   "7:00 PM",
//   "7:30 PM",
//   "8:00 PM",
//   "8:30 PM",
//   "9:00 PM",
//   "9:30 PM",
// ]

// function convertToTableTypes(dbTables: ReservationsClientProps["tables"]): TableType[] {
//   const positions: [number, number, number][] = [
//     [-8, 0, -6],
//     [8, 0, -6],
//     [0, 0, 8],
//     [-6, 0, 2],
//     [6, 0, 2],
//     [-4, 0, -2],
//     [4, 0, -2],
//     [0, 0, -8],
//   ]

//   const colors = ["#d4af37", "#2c3e50", "#8b4513", "#34495e", "#8b0000", "#556b2f", "#800080", "#008080"]
//   const emojis = ["💕", "💼", "👨‍👩‍👧‍👦", "👨‍🍳", "⭐", "🌿", "🎭", "🌊"]

//   return dbTables.map((table, index) => ({
//     id: table.id,
//     number: table.number,
//     capacity: table.capacity,
//     location: table.location,
//     position: positions[index % positions.length],
//     color: colors[index % colors.length],
//     emoji: emojis[index % emojis.length],
//     shape: table.capacity <= 2 ? "round" : table.capacity <= 4 ? "square" : "rectangular",
//   }))
// }

// // Enhanced Table Component with realistic materials
// function RestaurantTable({ table, isSelected, isHovered, onClick, onHover, onUnhover }: AnimatedTableProps) {
//   const tableRef = useRef<THREE.Group>(null)

//   useFrame((state) => {
//     if (tableRef.current) {
//       // Subtle floating animation only when selected or hovered
//       if (isSelected || isHovered) {
//         tableRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
//       } else {
//         tableRef.current.position.y = 0
//       }
//     }
//   })

//   // Create table geometry based on shape
//   const getTableGeometry = () => {
//     switch (table.shape) {
//       case "round":
//         return <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
//       case "square":
//         return <boxGeometry args={[2.5, 0.1, 2.5]} />
//       case "rectangular":
//         return <boxGeometry args={[3.5, 0.1, 2]} />
//       default:
//         return <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
//     }
//   }

//   // Get chair positions based on table shape
//   const getChairPositions = () => {
//     const positions = []
//     const chairDistance = table.shape === "rectangular" ? 2.2 : 2.2

//     if (table.shape === "round") {
//       const angleStep = (Math.PI * 2) / table.capacity
//       for (let i = 0; i < table.capacity; i++) {
//         const angle = i * angleStep
//         positions.push([Math.cos(angle) * chairDistance, 0, Math.sin(angle) * chairDistance])
//       }
//     } else if (table.shape === "rectangular") {
//       const longSide = Math.ceil(table.capacity / 2)
//       const shortSide = Math.floor(table.capacity / 2)

//       // Long sides
//       for (let i = 0; i < longSide; i++) {
//         positions.push([-(longSide - 1) * 0.6 + i * 1.2, 0, chairDistance])
//       }
//       for (let i = 0; i < shortSide; i++) {
//         positions.push([-(shortSide - 1) * 0.6 + i * 1.2, 0, -chairDistance])
//       }
//     } else {
//       // square
//       const perSide = table.capacity / 4
//       const offset = 1.5

//       // Four sides of the square
//       for (let i = 0; i < perSide; i++) {
//         positions.push([offset, 0, -offset + i * ((offset * 2) / (perSide - 1))])
//         positions.push([-offset, 0, -offset + i * ((offset * 2) / (perSide - 1))])
//         positions.push([-offset + i * ((offset * 2) / (perSide - 1)), 0, offset])
//         positions.push([-offset + i * ((offset * 2) / (perSide - 1)), 0, -offset])
//       }
//     }

//     return positions.slice(0, table.capacity)
//   }

//   const chairPositions = getChairPositions()

//   // Enhanced materials
//   const tableMaterial = new THREE.MeshStandardMaterial({
//     color: isSelected ? "#ffd700" : isHovered ? "#e6c200" : table.color,
//     roughness: 0.2,
//     metalness: 0.1,
//     emissive: isSelected || isHovered ? new THREE.Color("#333300") : new THREE.Color("#000000"),
//     emissiveIntensity: isSelected || isHovered ? 0.1 : 0,
//   })

//   const legMaterial = new THREE.MeshStandardMaterial({
//     color: "#2c3e50",
//     roughness: 0.8,
//     metalness: 0.2,
//   })

//   const chairMaterial = new THREE.MeshStandardMaterial({
//     color: "#34495e",
//     roughness: 0.6,
//     metalness: 0.1,
//   })

//   return (
//     <group
//       position={table.position}
//       ref={tableRef}
//       onClick={() => onClick(table)}
//       onPointerEnter={() => onHover(table.id)}
//       onPointerLeave={onUnhover}
//     >
//       {/* Table Top */}
//       <mesh position={[0, 0.8, 0]} material={tableMaterial}>
//         {getTableGeometry()}
//       </mesh>

//       {/* Table Legs */}
//       {table.shape === "round" ? (
//         // Center pedestal for round tables
//         <mesh position={[0, 0, 0]}>
//           <cylinderGeometry args={[0.3, 0.4, 1.6]} />
//           <primitive object={legMaterial} />
//         </mesh>
//       ) : (
//         // Four legs for square/rectangular tables
//         <>
//           <mesh position={[table.shape === "rectangular" ? 1.4 : 1, -0.05, table.shape === "rectangular" ? 0.7 : 1]}>
//             <cylinderGeometry args={[0.08, 0.08, 1.6]} />
//             <primitive object={legMaterial} />
//           </mesh>
//           <mesh position={[table.shape === "rectangular" ? -1.4 : -1, -0.05, table.shape === "rectangular" ? 0.7 : 1]}>
//             <cylinderGeometry args={[0.08, 0.08, 1.6]} />
//             <primitive object={legMaterial} />
//           </mesh>
//           <mesh position={[table.shape === "rectangular" ? 1.4 : 1, -0.05, table.shape === "rectangular" ? -0.7 : -1]}>
//             <cylinderGeometry args={[0.08, 0.08, 1.6]} />
//             <primitive object={legMaterial} />
//           </mesh>
//           <mesh
//             position={[table.shape === "rectangular" ? -1.4 : -1, -0.05, table.shape === "rectangular" ? -0.7 : -1]}
//           >
//             <cylinderGeometry args={[0.08, 0.08, 1.6]} />
//             <primitive object={legMaterial} />
//           </mesh>
//         </>
//       )}

//       {/* Chairs */}
//       {chairPositions.map((pos, i) => (
//         <group key={i} position={pos as [number, number, number]}>
//           {/* Chair Seat */}
//           <mesh position={[0, 0.4, 0]}>
//             <boxGeometry args={[0.4, 0.05, 0.4]} />
//             <primitive object={chairMaterial} />
//           </mesh>
//           {/* Chair Back */}
//           <mesh position={[0, 0.7, -0.15]}>
//             <boxGeometry args={[0.4, 0.6, 0.05]} />
//             <primitive object={chairMaterial} />
//           </mesh>
//           {/* Chair Legs */}
//           {[
//             [-0.15, -0.15],
//             [0.15, -0.15],
//             [-0.15, 0.15],
//             [0.15, 0.15],
//           ].map((legPos, legIndex) => (
//             <mesh key={legIndex} position={[legPos[0], -0.2, legPos[1]]}>
//               <cylinderGeometry args={[0.02, 0.02, 0.8]} />
//               <primitive object={chairMaterial} />
//             </mesh>
//           ))}
//         </group>
//       ))}

//       {/* Selection Indicator */}
//       {(isSelected || isHovered) && (
//         <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//           <ringGeometry
//             args={[
//               table.shape === "rectangular" ? 2.5 : table.shape === "square" ? 2.2 : 2,
//               table.shape === "rectangular" ? 2.8 : table.shape === "square" ? 2.5 : 2.3,
//               32,
//             ]}
//           />
//           <meshBasicMaterial
//             color={isSelected ? "#ffd700" : "#ffffff"}
//             transparent
//             opacity={0.6}
//             side={THREE.DoubleSide}
//           />
//         </mesh>
//       )}
//     </group>
//   )
// }

// // Enhanced Scene with better lighting and atmosphere
// function RestaurantScene({ onTableSelect, selectedTable, tables }: TableSceneProps) {
//   const [hoveredTable, setHoveredTable] = useState<string | null>(null)

//   return (
//     <>
//       {/* Enhanced Lighting Setup */}
//       <ambientLight intensity={0.3} color="#ffffff" />

//       {/* Main overhead lighting */}
//       <directionalLight
//         position={[10, 15, 5]}
//         intensity={0.8}
//         color="#ffffff"
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />

//       {/* Warm accent lighting */}
//       <pointLight position={[-8, 8, -8]} intensity={0.6} color="#ffaa44" />
//       <pointLight position={[8, 8, 8]} intensity={0.6} color="#44aaff" />

//       {/* Spotlight for drama */}
//       <spotLight
//         position={[0, 12, 0]}
//         angle={Math.PI / 3}
//         penumbra={0.5}
//         intensity={0.5}
//         color="#ffffff"
//         target-position={[0, 0, 0]}
//       />

//       {/* Tables */}
//       {tables.map((table) => (
//         <RestaurantTable
//           key={table.id}
//           table={table}
//           isSelected={selectedTable?.id === table.id}
//           isHovered={hoveredTable === table.id}
//           onClick={onTableSelect}
//           onHover={setHoveredTable}
//           onUnhover={() => setHoveredTable(null)}
//         />
//       ))}

//       {/* Restaurant Floor */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
//         <planeGeometry args={[40, 40]} />
//         <meshStandardMaterial color="#2c2c2c" roughness={0.8} metalness={0.1} />
//       </mesh>

//       {/* Decorative ceiling */}
//       <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
//         <planeGeometry args={[40, 40]} />
//         <meshStandardMaterial color="#1a1a2e" roughness={0.9} emissive="#0a0a1a" emissiveIntensity={0.1} />
//       </mesh>

//       {/* Wall elements for depth */}
//       <mesh position={[-20, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[40, 8]} />
//         <meshStandardMaterial color="#2a2a3a" roughness={0.8} />
//       </mesh>
//       <mesh position={[20, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[40, 8]} />
//         <meshStandardMaterial color="#2a2a3a" roughness={0.8} />
//       </mesh>
//     </>
//   )
// }

// // Smooth camera movement with wider view
// function CameraController() {
//   useFrame((state) => {
//     const time = state.clock.elapsedTime * 0.15
//     state.camera.position.x = Math.sin(time) * 16
//     state.camera.position.z = Math.cos(time) * 16
//     state.camera.position.y = 10 + Math.sin(time * 0.5) * 2
//     state.camera.lookAt(0, 0, 0)
//   })

//   return null
// }

// // Calendar Component
// function ReservationCalendar({ selectedDate, onDateSelect }: CalendarProps) {
//   const today = new Date()
//   const currentMonth = today.getMonth()
//   const currentYear = today.getFullYear()
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
//   const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

//   const calendarDays: Array<{
//     day: number
//     date: string
//     isPast: boolean
//     isToday: boolean
//     isSelected: boolean
//     isAvailable: boolean
//   } | null> = []

//   for (let i = 0; i < firstDayOfMonth; i++) {
//     calendarDays.push(null)
//   }

//   for (let day = 1; day <= daysInMonth; day++) {
//     const date = new Date(currentYear, currentMonth, day)
//     const dateString = date.toISOString().split("T")[0]
//     const isPast = date < today
//     const isToday = date.toDateString() === today.toDateString()
//     const isSelected = dateString === selectedDate
//     const isAvailable = !isPast && Math.random() > 0.2

//     calendarDays.push({
//       day,
//       date: dateString,
//       isPast,
//       isToday,
//       isSelected,
//       isAvailable,
//     })
//   }

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ]

//   return (
//     <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
//       <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
//         <h3 className="text-xl font-bold text-white text-center">
//           {monthNames[currentMonth]} {currentYear}
//         </h3>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-7 gap-2 mb-4">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//             <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-2">
//           {calendarDays.map((day, index) => (
//             <div key={index} className="aspect-square">
//               {day && (
//                 <button
//                   className={`w-full h-full  rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
//                     day.isPast
//                       ? "opacity-30 cursor-not-allowed text-gray-600"
//                       : day.isAvailable
//                         ? day.isSelected
//                           ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
//                           : "hover:bg-purple-500/20 text-white hover:shadow-lg hover:shadow-purple-500/30"
//                         : "opacity-50 cursor-not-allowed bg-gray-700/50 text-white"
//                   } ${day.isToday ? "ring-2 ring-purple-400" : ""}`}
//                   disabled={day.isPast || !day.isAvailable}
//                   onClick={() => day.isAvailable && onDateSelect(day.date)}
//                 >
//                   {day.day}
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="flex items-center justify-center gap-6 mt-6 text-sm">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
//             <span className="text-gray-300">Available</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
//             <span className="text-gray-300">Booked</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Time Selection Component
// function TimeSlotSelection({ selectedTime, onTimeSelect, selectedDate }: TimeSlotProps) {
//   return (
//     <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
//       <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
//         <h3 className="text-xl font-bold text-white flex items-center gap-2">
//           <span>🕒</span> Available Times
//         </h3>
//       </div>

//       <div className="p-6">
//         {!selectedDate ? (
//           <div className="text-center py-8">
//             <div className="text-4xl mb-4">📅</div>
//             <p className="text-gray-400">Please select a date first</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-3">
//             {timeSlots.map((time) => {
//               const isAvailable = Math.random() > 0.3
//               const isSelected = time === selectedTime

//               return (
//                 <button
//                   key={time}
//                   className={`p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
//                     isSelected
//                       ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
//                       : isAvailable
//                         ? "bg-purple-500/20 text-white hover:bg-purple-500/30 hover:shadow-lg hover:shadow-purple-500/30"
//                         : "opacity-50 cursor-not-allowed bg-gray-700/30 text-gray-500"
//                   }`}
//                   disabled={!isAvailable}
//                   onClick={() => isAvailable && onTimeSelect(time)}
//                 >
//                   {time}
//                 </button>
//               )
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // Main Component
// export default function ReservationsClient({ tables: dbTables }: ReservationsClientProps) {
//   const [selectedTable, setSelectedTable] = useState<TableType | null>(null)
//   const [selectedDate, setSelectedDate] = useState("")
//   const [selectedTime, setSelectedTime] = useState("")
//   const [guests, setGuests] = useState(2)
//   const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
//     name: "",
//     email: "",
//     phone: "",
//     requests: "",
//   })
//   const [isConfirmed, setIsConfirmed] = useState(false)
//   const [isPending, startTransition] = useTransition()
//   const { toast } = useToast()

//   const tables = convertToTableTypes(dbTables)

//   const handleSubmit = () => {
//     if (selectedTable && selectedDate && selectedTime && customerInfo.name && customerInfo.email) {
//       startTransition(async () => {
//         try {
//           await createReservation({
//             tableId: selectedTable.id,
//             customerName: customerInfo.name,
//             customerEmail: customerInfo.email,
//             customerPhone: customerInfo.phone || undefined,
//             date: new Date(selectedDate + "T" + convertTo24Hour(selectedTime)),
//             partySize: guests,
//             specialRequests: customerInfo.requests || undefined,
//           })

//           toast({
//             title: "Reservation Confirmed!",
//             description: "We look forward to serving you.",
//           })

//           setIsConfirmed(true)
//         } catch (error) {
//           toast({
//             title: "Error",
//             description: "Failed to create reservation. Please try again.",
//             variant: "destructive",
//           })
//         }
//       })
//     }
//   }

//   const convertTo24Hour = (time12h: string) => {
//     const [time, modifier] = time12h.split(" ")
//     let [hours, minutes] = time.split(":")
//     if (hours === "12") {
//       hours = "00"
//     }
//     if (modifier === "PM") {
//       hours = (Number.parseInt(hours, 10) + 12).toString()
//     }
//     return `${hours}:${minutes}:00`
//   }

//   const isFormValid = selectedTable && selectedDate && selectedTime && customerInfo.name && customerInfo.email

//   if (isConfirmed && selectedTable) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
//         <div className="text-center space-y-6 animate-pulse">
//           <div className="text-6xl mb-6">✅</div>
//           <h2 className="text-4xl font-bold text-white mb-4">Reservation Confirmed!</h2>
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-white/20">
//             <div className="space-y-4 text-left">
//               <div className="flex justify-between text-white">
//                 <span>Date:</span>
//                 <span className="font-semibold">{new Date(selectedDate).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between text-white">
//                 <span>Time:</span>
//                 <span className="font-semibold">{selectedTime}</span>
//               </div>
//               <div className="flex justify-between text-white">
//                 <span>Table:</span>
//                 <span className="font-semibold">
//                   Table {selectedTable.number} ({selectedTable.location})
//                 </span>
//               </div>
//               <div className="flex justify-between text-white">
//                 <span>Guests:</span>
//                 <span className="font-semibold">{guests}</span>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={() => {
//               setIsConfirmed(false)
//               setSelectedTable(null)
//               setSelectedDate("")
//               setSelectedTime("")
//               setCustomerInfo({ name: "", email: "", phone: "", requests: "" })
//             }}
//             className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
//           >
//             Make Another Reservation
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
//       <div className="absolute inset-0 opacity-20"></div>

//       <div className="relative z-10 container mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
//             Reserve Your Perfect Table
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Experience culinary excellence in our beautifully designed dining room
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Column - 3D Scene */}
//           <div className="space-y-6">
//             <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
//                 <h3 className="text-xl font-bold text-white">Select Your Table</h3>
//                 <p className="text-purple-100 text-sm">Click on any table to view details and make your selection</p>
//               </div>

//               <div className="h-96 w-full bg-gradient-to-b from-slate-800/50 to-slate-900/50">
//                 <Canvas camera={{ position: [16, 10, 16], fov: 65 }} shadows gl={{ antialias: true, alpha: true }}>
//                   <Suspense fallback={null}>
//                     <RestaurantScene onTableSelect={setSelectedTable} selectedTable={selectedTable} tables={tables} />
//                     <CameraController />
//                   </Suspense>
//                 </Canvas>
//               </div>

//               {/* Navigation hint */}
//               <div className="p-4 bg-slate-800/50 border-t border-purple-500/20">
//                 <p className="text-center text-sm text-gray-400">
//                   🖱️ The camera automatically rotates around the dining room
//                 </p>
//               </div>
//             </div>

//             {/* Enhanced Table Details */}
//             {selectedTable && (
//               <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-2xl font-bold text-white flex items-center gap-3">
//                     <span className="text-3xl">{selectedTable.emoji}</span>
//                     <div>
//                       <div>Table {selectedTable.number}</div>
//                       <div className="text-sm text-gray-400 font-normal">
//                         {selectedTable.location} •{" "}
//                         {selectedTable.shape.charAt(0).toUpperCase() + selectedTable.shape.slice(1)} table
//                       </div>
//                     </div>
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
//                     <div className="text-purple-300 text-sm">Capacity</div>
//                     <div className="text-white font-semibold">Up to {selectedTable.capacity} guests</div>
//                   </div>
//                   <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
//                     <div className="text-purple-300 text-sm">Location</div>
//                     <div className="text-white font-semibold">{selectedTable.location}</div>
//                   </div>
//                 </div>

//                 <div className="text-gray-300">
//                   <p>Perfect for intimate dining with excellent service and ambiance.</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Booking Form */}
//           <div className="space-y-6">
//             <ReservationCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

//             <TimeSlotSelection selectedTime={selectedTime} onTimeSelect={setSelectedTime} selectedDate={selectedDate} />

//             {/* Customer Information */}
//             <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl border border-purple-500/20">
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
//                 <h3 className="text-xl font-bold text-white">Your Information</h3>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-300 text-sm font-medium mb-2">Party Size</label>
//                     <select
//                       value={guests}
//                       onChange={(e) => setGuests(Number(e.target.value))}
//                       className="w-full bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     >
//                       {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                         <option key={num} value={num}>
//                           {num} Guest{num > 1 ? "s" : ""}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-gray-300 text-sm font-medium mb-2">Selected Table</label>
//                     <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white flex items-center gap-2">
//                       {selectedTable ? (
//                         <>
//                           <span>{selectedTable.emoji}</span>
//                           <span className="truncate">Table {selectedTable.number}</span>
//                         </>
//                       ) : (
//                         <span className="text-gray-400">No table selected</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
//                   <input
//                     type="text"
//                     value={customerInfo.name}
//                     onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
//                     className="w-full bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     placeholder="Enter your full name"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
//                     <input
//                       type="email"
//                       value={customerInfo.email}
//                       onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       className="w-full bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       placeholder="your@email.com"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
//                     <input
//                       type="tel"
//                       value={customerInfo.phone}
//                       onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                       className="w-full bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       placeholder="(555) 123-4567"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-300 text-sm font-medium mb-2">Special Requests</label>
//                   <textarea
//                     value={customerInfo.requests}
//                     onChange={(e) => setCustomerInfo((prev) => ({ ...prev, requests: e.target.value }))}
//                     className="w-full bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//                     placeholder="Dietary restrictions, anniversary celebration, window seating preference, etc..."
//                     rows={3}
//                   />
//                 </div>

//                 {/* Reservation Summary */}
//                 <div className="border-t border-purple-500/20 pt-6">
//                   <h4 className="text-lg font-semibold text-white mb-4">Reservation Summary</h4>

//                   <div className="bg-slate-800/50 rounded-xl p-4 mb-4 space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Date:</span>
//                       <span className="text-white">
//                         {selectedDate
//                           ? new Date(selectedDate).toLocaleDateString("en-US", {
//                               weekday: "long",
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             })
//                           : "Not selected"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Time:</span>
//                       <span className="text-white">{selectedTime || "Not selected"}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Table:</span>
//                       <span className="text-white">
//                         {selectedTable
//                           ? `Table ${selectedTable.number} (${selectedTable.capacity} seats)`
//                           : "Not selected"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-400">Party Size:</span>
//                       <span className="text-white">
//                         {guests} guest{guests > 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleSubmit}
//                     disabled={!isFormValid || isPending}
//                     className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
//                       isFormValid && !isPending
//                         ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60"
//                         : "bg-gray-600 text-gray-400 cursor-not-allowed"
//                     }`}
//                   >
//                     {isPending
//                       ? "Creating Reservation..."
//                       : isFormValid
//                         ? "Confirm Reservation ✨"
//                         : "Please Complete All Required Fields"}
//                   </button>

//                   <p className="text-xs text-gray-400 text-center mt-3">
//                     * Required fields. You will receive a confirmation email shortly after booking.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
