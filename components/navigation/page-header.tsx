"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
}

export function PageHeader({ title, subtitle, showBackButton = true, backHref = "/" }: PageHeaderProps) {
  return (
    <div className="bg-card/95 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="hover:bg-sidebar-accent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {subtitle && (
          <Badge variant="secondary" className="animate-pulse-slow">
            {subtitle}
          </Badge>
        )}
      </div>
    </div>
  )
}
