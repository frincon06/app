import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from "@/components/app/app-header"
import { AppFooter } from "@/components/app/app-footer"
import { AppNavigation } from "@/components/app/app-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sagrapp - Estudio Bíblico Gamificado",
  description: "Aprende la Biblia de manera interactiva y divertida",
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          <AppNavigation />
          <AppFooter />
        </div>
      </ThemeProvider>
    </div>
  )
}
