"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Calendar, Sparkles, Home, BookOpen } from "lucide-react"
import { TransparentNavbar } from "./transparent-navbar"

const navItems = [
  { id: "home", icon: Home, label: "Home", href: "/" },
  { id: "menu", icon: BookOpen, label: "Menu", href: "/menu" },
  { id: "pickup", icon: ChefHat, label: "Pickup", href: "/pickup" },
  // { id: "reservations", icon: Calendar, label: "Reservations", href: "/reservations" },
  { id: "events", icon: Sparkles, label: "Events", href: "/events" },
]

export function FuturisticSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Get active section based on current pathname
  const getActiveSection = () => {
    const currentItem = navItems.find((item) => item.href === pathname)
    return currentItem?.id || "home"
  }

  const activeSection = getActiveSection()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <TransparentNavbar onMenuToggle={handleMobileToggle} isMobileMenuOpen={isMobileOpen} />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Card className="bg-slate-800/95 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardContent className="p-2">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`w-12 h-12 p-0 transition-all duration-300 group relative ${
                        isActive
                          ? "bg-purple-600 text-white scale-110 shadow-lg shadow-purple-500/25"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105"
                      }`}
                    >
                      <Icon className="w-5 h-5" />

                      {/* Tooltip */}
                      <div className="absolute left-full ml-3 px-2 py-1 bg-purple-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {item.label}
                      </div>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default FuturisticSidebar
