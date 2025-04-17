"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, Activity, LogOut } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check if user is logged in and is admin
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/")
        return
      }

      // Check if user is admin
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.session.user.id)
        .single()

      if (error || userData?.role !== "admin") {
        await supabase.auth.signOut()
        router.push("/")
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-700">Sagrapp</h1>
          <p className="text-sm text-gray-500">Panel de Administración</p>
        </div>

        <nav className="px-4 py-2">
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard")}>
                <Activity className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/courses")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Cursos
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard/users")}>
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/decisions")}
              >
                <Award className="mr-2 h-4 w-4" />
                Decisiones
              </Button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
