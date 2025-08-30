"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

interface TransparentNavbarProps {
  onMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export function TransparentNavbar({ onMenuToggle, isMobileMenuOpen }: TransparentNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt=" House of Bek Catering"
                width={100}
                height={80}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={onMenuToggle}
              className={`transition-all duration-300 ${
                isScrolled
                  ? "bg-slate-800/95 backdrop-blur-sm border-slate-700 text-white hover:bg-slate-700"
                  : "bg-slate-800/50 backdrop-blur-sm border-slate-600/50 text-white hover:bg-slate-700/70"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Desktop Navigation - Hidden for now since we're using sidebar */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Optional: Add desktop nav items here if needed */}
          </div>
        </div>
      </div>
    </nav>
  )
}
