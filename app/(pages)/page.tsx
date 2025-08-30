"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html, Float, Sphere, Box } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Calendar, Sparkles, ArrowRight, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// 3D Restaurant Interior Component
// function RestaurantScene() {
//   const [hoveredItem, setHoveredItem] = useState<string | null>(null)

//   return (
//     <>
//       <Environment preset="sunset" />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} intensity={1} />

//       {/* Floating Food Items */}
//       <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
//         <Box
//           position={[-3, 2, 0]}
//           args={[1, 1, 1]}
//           onPointerEnter={() => setHoveredItem("dish1")}
//           onPointerLeave={() => setHoveredItem(null)}
//         >
//           <meshStandardMaterial
//             color={hoveredItem === "dish1" ? "#8b5cf6" : "#f97316"}
//             emissive={hoveredItem === "dish1" ? "#8b5cf6" : "#000000"}
//             emissiveIntensity={hoveredItem === "dish1" ? 0.3 : 0}
//           />
//           <Html position={[0, 1.5, 0]} center>
//             <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 text-xs font-semibold text-card-foreground border border-slate-700">
//               Signature Dish
//             </div>
//           </Html>
//         </Box>
//       </Float>

//       <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
//         <Sphere
//           position={[3, 1, -2]}
//           args={[0.8]}
//           onPointerEnter={() => setHoveredItem("dish2")}
//           onPointerLeave={() => setHoveredItem(null)}
//         >
//           <meshStandardMaterial
//             color={hoveredItem === "dish2" ? "#8b5cf6" : "#ea580c"}
//             emissive={hoveredItem === "dish2" ? "#8b5cf6" : "#000000"}
//             emissiveIntensity={hoveredItem === "dish2" ? 0.3 : 0}
//           />
//           <Html position={[0, 1.2, 0]} center>
//             <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 text-xs font-semibold text-card-foreground border border-slate-700">
//               Chef's Special
//             </div>
//           </Html>
//         </Sphere>
//       </Float>

//       <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.5}>
//         <Box
//           position={[0, -1, 2]}
//           args={[1.2, 0.3, 1.2]}
//           onPointerEnter={() => setHoveredItem("table")}
//           onPointerLeave={() => setHoveredItem(null)}
//         >
//           <meshStandardMaterial
//             color={hoveredItem === "table" ? "#8b5cf6" : "#1f2937"}
//             emissive={hoveredItem === "table" ? "#8b5cf6" : "#000000"}
//             emissiveIntensity={hoveredItem === "table" ? 0.2 : 0}
//           />
//           <Html position={[0, 0.5, 0]} center>
//             <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 text-xs font-semibold text-card-foreground border border-slate-700">
//               Reserve Table
//             </div>
//           </Html>
//         </Box>
//       </Float>

//       {/* Floating Text */}
//       <Text
//         position={[0, 4, -3]}
//         fontSize={1.5}
//         color="#8b5cf6"
//         anchorX="center"
//         anchorY="middle"
//         font="/fonts/Geist-Bold.ttf"
//       >
//         House of Bek
//       </Text>
//     </>
//   )
// }

// Hero Section Component
function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero2.png"
          alt="Modern restaurant interior"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* 3D Canvas Background - Hidden on mobile for performance */}
      {/* <div className="absolute inset-0 hidden lg:block">
        <Canvas camera={{ position: [0, 2, 10], fov: 60 }} style={{ background: "transparent" }}>
          <Suspense fallback={null}>
            <RestaurantScene />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
            />
          </Suspense>
        </Canvas>
      </div> */}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="animate-float">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                House of Bek
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-6 sm:mb-8 drop-shadow-md px-4">
                Experience the Future of Dining
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-pulse-slow px-4">
              <Link href="/pickup" className="w-full sm:w-auto">
                <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto">
                  Order Pickup <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/reservations" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent w-full sm:w-auto"
                >
                  Make Reservation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Services Preview Section
function ServicesPreview() {
  const services = [
    {
      title: "Pickup Orders",
      description: "Interactive menu with real-time customization",
      icon: ChefHat,
      color: "from-orange-500 to-red-500",
      href: "/pickup",
      image: "/chef-cooking-action.png",
    },
    {
      title: "Table Reservations",
      description: "Dynamic booking with live availability",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      href: "/reservations",
      image: "/fine-dining-table-setup.png",
    },
    {
      title: "Special Events",
      description: "Immersive event planning and booking",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      href: "/events",
      image: "/private-dining-room.png",
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Our Services</h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            Discover a new dimension of dining with our cutting-edge interactive platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link key={index} href={service.href}>
                <Card className="group hover:scale-105 transition-all duration-300 bg-slate-800/50 border-slate-700 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:animate-pulse`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-sm sm:text-base text-slate-300">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function RestaurantShowcase() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Experience Our Space</h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            From our artisan kitchen to our elegant dining areas, every corner tells a story
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden group">
            <Image
              src="/restaurant-bar-area.png"
              alt="Restaurant bar area"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <h3 className="text-base sm:text-lg font-bold">Craft Bar</h3>
              <p className="text-xs sm:text-sm opacity-90">Artisan cocktails & fine wines</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden group">
            <Image
              src="/outdoor-dining-patio.png"
              alt="Outdoor dining patio"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <h3 className="text-base sm:text-lg font-bold">Garden Terrace</h3>
              <p className="text-xs sm:text-sm opacity-90">Al fresco dining experience</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden group sm:col-span-2 lg:col-span-1">
            <Image
              src="/artisan-pizza-oven.png"
              alt="Artisan pizza oven"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <h3 className="text-base sm:text-lg font-bold">Open Kitchen</h3>
              <p className="text-xs sm:text-sm opacity-90">Watch our chefs create magic</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden group sm:col-span-2">
            <Image
              src="/fresh-ingredients-display.png"
              alt="Fresh ingredients display"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <h3 className="text-base sm:text-lg font-bold">Farm Fresh Ingredients</h3>
              <p className="text-xs sm:text-sm opacity-90">Locally sourced, daily delivered</p>
            </div>
          </div>

          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden group">
            <Image
              src="/wine-cellar-selection.png"
              alt="Wine cellar selection"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
              <h3 className="text-base sm:text-lg font-bold">Wine Cellar</h3>
              <p className="text-xs sm:text-sm opacity-90">Curated selection of vintages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/restaurant-entrance.png" alt="Restaurant entrance" fill className="object-cover opacity-20" />
      </div>
      <div className="absolute inset-0 bg-purple-600/80" />

      <div className="relative max-w-4xl mx-auto text-center text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 px-4">
          Ready to Experience the Future?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8 px-4">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>(555) 123-houseofbek</span>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>123 Future Ave, Tech City</span>
          </div>
        </div>
        <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-slate-100">
          Get Started Today
        </Button>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesPreview />
      <RestaurantShowcase />
      <ContactSection />
    </main>
  )
}
