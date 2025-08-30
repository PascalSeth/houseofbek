import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "../globals.css"
import FuturisticSidebar from "@/components/navigation/futuristic-sidebar"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Hous of Bek Restaurant ",
  description:
    "Experience the future of dining with our interactive 3D restaurant platform. Order pickup, make reservations, and book events.",
  generator: "houseofbek.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <FuturisticSidebar />
          <div className="ml-0 lg:ml-20">{children}</div>
        </div>
      </body>
    </html>
  )
}
