"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Trophy, Star, Zap, BookOpen } from "lucide-react"
import { calculateUserLevel } from "@/lib/gamification"

interface AchievementsScreenProps {
  userProgress: any[]
}

export function AchievementsScreen({ userProgress }: AchievementsScreenProps) {
  // Calcular estadísticas
  const totalXp = userProgress.reduce((total, progress) => total + (progress.xp_earned || 0), 0)
  const completedLessons = userProgress.filter((progress) => progress.completed).length
  const { level } = calculateUserLevel(totalXp)

  // Definir logros
  const achievements = [
    {
      id: "first_lesson",
      title: "Primer Paso",
      description: "Completa tu primera lección",
      icon: <BookOpen className="h-6 w-6" />,
      unlocked: completedLessons > 0,
      progress: completedLessons > 0 ? 100 : 0,
      xp: 50,
    },
    {
      id: "five_lessons",
      title: "Estudioso",
      description: "Completa 5 lecciones",
      icon: <BookOpen className="h-6 w-6" />,
      unlocked: completedLessons >= 5,
      progress: Math.min((completedLessons / 5) * 100, 100),
      xp: 100,
    },
    {
      id: "level_3",
      title: "Dedicado",
      description: "Alcanza el nivel 3",
      icon: <Award className="h-6 w-6" />,
      unlocked: level >= 3,
      progress: Math.min((level / 3) * 100, 100),
      xp: 150,
    },
    {
      id: "level_5",
      title: "Experto",
      description: "Alcanza el nivel 5",
      icon: <Trophy className="h-6 w-6" />,
      unlocked: level >= 5,
      progress: Math.min((level / 5) * 100, 100),
      xp: 250,
    },
    {
      id: "level_10",
      title: "Maestro",
      description: "Alcanza el nivel 10",
      icon: <Star className="h-6 w-6" />,
      unlocked: level >= 10,
      progress: Math.min((level / 10) * 100, 100),
      xp: 500,
    },
    {
      id: "twenty_lessons",
      title: "Disciplinado",
      description: "Completa 20 lecciones",
      icon: <Zap className="h-6 w-6" />,
      unlocked: completedLessons >= 20,
      progress: Math.min((completedLessons / 20) * 100, 100),
      xp: 300,
    },
  ]

  // Filtrar logros desbloqueados y bloqueados
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold mb-4">Logros</h1>

      {/* Resumen */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 text-purple-700 rounded-full p-3 mr-4">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {unlockedAchievements.length} de {achievements.length} logros
              </h2>
              <p className="text-gray-500">Sigue aprendiendo para desbloquear más</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pestañas */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="unlocked">Desbloqueados</TabsTrigger>
          <TabsTrigger value="locked">Bloqueados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-4">
          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Aún no has desbloqueado ningún logro</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locked" className="mt-4">
          {lockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">¡Has desbloqueado todos los logros!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: any }) {
  return (
    <Card className={`overflow-hidden ${!achievement.unlocked ? "opacity-75" : ""}`}>
      <div className={`h-2 ${achievement.unlocked ? "bg-green-500" : "bg-gray-300"}`} />
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div
            className={`rounded-full p-2 mr-3 ${achievement.unlocked ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
          >
            {achievement.icon}
          </div>
          <div>
            <h3 className="font-bold">{achievement.title}</h3>
            <p className="text-sm text-gray-500">{achievement.description}</p>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs">
          <span>{achievement.unlocked ? "Completado" : `${Math.round(achievement.progress)}%`}</span>
          <span>+{achievement.xp} XP</span>
        </div>
        <Progress value={achievement.progress} className="h-2" />
      </CardContent>
    </Card>
  )
}
