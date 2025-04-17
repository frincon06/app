"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Activity } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import CoursesList from "@/components/dashboard/courses-list"
import RecentDecisions from "@/components/dashboard/recent-decisions"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    totalDecisions: 0,
    averageStreak: 0,
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Get total users
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

      // Get total courses
      const { count: coursesCount } = await supabase.from("courses").select("*", { count: "exact", head: true })

      // Get total lessons
      const { count: lessonsCount } = await supabase.from("lessons").select("*", { count: "exact", head: true })

      // Get total decisions
      const { count: decisionsCount } = await supabase
        .from("user_decisions")
        .select("*", { count: "exact", head: true })

      // Get average streak
      const { data: streakData } = await supabase.from("users").select("streak_days")

      const averageStreak = streakData
        ? streakData.reduce((sum, user) => sum + (user.streak_days || 0), 0) / (streakData.length || 1)
        : 0

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalLessons: lessonsCount || 0,
        totalDecisions: decisionsCount || 0,
        averageStreak: Math.round(averageStreak * 10) / 10,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader title="Dashboard" description="Vista general de la aplicación" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats
          title="Usuarios"
          value={stats.totalUsers.toString()}
          icon={<Users className="h-5 w-5" />}
          description="Total de usuarios registrados"
        />
        <DashboardStats
          title="Cursos"
          value={stats.totalCourses.toString()}
          icon={<BookOpen className="h-5 w-5" />}
          description="Cursos disponibles"
        />
        <DashboardStats
          title="Lecciones"
          value={stats.totalLessons.toString()}
          icon={<BookOpen className="h-5 w-5" />}
          description="Total de lecciones"
        />
        <DashboardStats
          title="Racha Promedio"
          value={stats.averageStreak.toString()}
          icon={<Activity className="h-5 w-5" />}
          description="Días promedio de racha"
        />
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Cursos Recientes</TabsTrigger>
          <TabsTrigger value="decisions">Decisiones Recientes</TabsTrigger>
        </TabsList>
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Cursos</CardTitle>
              <CardDescription>Lista de cursos disponibles en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <CoursesList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>Decisiones Recientes</CardTitle>
              <CardDescription>Últimas decisiones tomadas por los usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentDecisions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
