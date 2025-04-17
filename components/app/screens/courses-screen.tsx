"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Lock } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  sort_order: number
  is_locked: boolean
}

interface UserProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string
  completed: boolean
  xp_earned: number
  created_at: string
  updated_at: string
}

interface CoursesScreenProps {
  courses: Course[]
  userProgress: UserProgress[]
}

export function CoursesScreen({ courses, userProgress }: CoursesScreenProps) {
  // Calcular el progreso por curso
  const getCourseProgress = (courseId: string) => {
    const courseProgressEntries = userProgress.filter(
      (progress) => progress.course_id === courseId && progress.completed,
    )

    // Simulamos que cada curso tiene 10 lecciones para calcular el porcentaje
    // En una implementación real, deberías contar las lecciones reales del curso
    const totalLessons = 10
    const completedLessons = courseProgressEntries.length

    return {
      completedLessons,
      totalLessons,
      percentage: Math.min(Math.round((completedLessons / totalLessons) * 100), 100),
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold mb-4">Cursos Disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const progress = getCourseProgress(course.id)

          return (
            <Card key={course.id} className={`overflow-hidden ${course.is_locked ? "opacity-75" : ""}`}>
              <div className="h-40 bg-gray-200 relative">
                {course.image_url ? (
                  <img
                    src={course.image_url || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {course.is_locked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Lock className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      {progress.completedLessons} de {progress.totalLessons} lecciones
                    </span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                </div>

                {course.is_locked ? (
                  <Button className="w-full" disabled>
                    Bloqueado
                  </Button>
                ) : (
                  <Link href={`/app/courses/${course.id}`}>
                    <Button className="w-full">{progress.completedLessons > 0 ? "Continuar" : "Comenzar"}</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
