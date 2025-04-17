"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Calendar, LogOut } from "lucide-react"
import { calculateUserLevel } from "@/lib/gamification"
import { formatDate } from "@/lib/utils"

interface ProfileScreenProps {
  user: any
  userData: any
  userProgress: any[]
  userActivities: any[]
}

export function ProfileScreen({ user, userData, userProgress, userActivities }: ProfileScreenProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Calcular estadísticas
  const totalXp = userProgress.reduce((total, progress) => total + (progress.xp_earned || 0), 0)
  const completedLessons = userProgress.filter((progress) => progress.completed).length
  const { level, nextLevelXp, progress } = calculateUserLevel(totalXp)

  // Manejar cierre de sesión
  const handleSignOut = async () => {
    setIsLoggingOut(true)

    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

      {/* Tarjeta de perfil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold mr-4">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{userData.full_name || user.email}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nivel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-700 rounded-full p-2 mr-3">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">{level}</span>
            </div>
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {totalXp} / {nextLevelXp} XP
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">{completedLessons}</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Lecciones completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas */}
      <Tabs defaultValue="activities" className="mt-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="activities">Actividades</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {userActivities.length > 0 ? (
                <div className="space-y-4">
                  {userActivities.map((activity) => (
                    <div key={activity.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{activity.activity_type}</span>
                        <span className="text-xs text-gray-500">{formatDate(activity.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No hay actividades recientes</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Logros simulados */}
                {[
                  { title: "Primer Paso", description: "Completa tu primera lección", unlocked: completedLessons > 0 },
                  { title: "Estudioso", description: "Completa 5 lecciones", unlocked: completedLessons >= 5 },
                  { title: "Dedicado", description: "Alcanza el nivel 3", unlocked: level >= 3 },
                  { title: "Experto", description: "Alcanza el nivel 5", unlocked: level >= 5 },
                ].map((achievement, index) => (
                  <Card key={index} className={`overflow-hidden ${!achievement.unlocked ? "opacity-50" : ""}`}>
                    <div className={`h-2 ${achievement.unlocked ? "bg-green-500" : "bg-gray-300"}`} />
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm">{achievement.title}</h3>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botón de cerrar sesión */}
      <Button variant="outline" className="w-full mt-6" onClick={handleSignOut} disabled={isLoggingOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  )
}
