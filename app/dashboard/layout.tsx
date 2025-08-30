import type React from "react"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import "../globals.css"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en" className={`antialiased`}>
      <body>
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64 p-6 bg-slate-400">{children}</main>
    </div></body>
    </html>
  )
}
