"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, Lock, ArrowLeft } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  sort_order: number
  is_locked: boolean
}

interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
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

interface CourseDetailScreenProps {
  course: Course
  lessons: Lesson[]
  userProgress: UserProgress[]
  userId: string
}

export function CourseDetailScreen({ course, lessons, userProgress, userId }: CourseDetailScreenProps) {
  // Calcular el progreso general del curso
  const completedLessons = userProgress.filter((progress) => progress.completed).length
  const totalLessons = lessons.length
  const progressPercentage = totalLessons > 0 ? Math.min(Math.round((completedLessons / totalLessons) * 100), 100) : 0

  // Verificar si una lección está completada
  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some((progress) => progress.lesson_id === lessonId && progress.completed)
  }

  // Determinar si una lección está desbloqueada
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true

    // Una lección está desbloqueada si la anterior está completada
    const previousLesson = lessons[index - 1]
    return previousLesson ? isLessonCompleted(previousLesson.id) : false
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center mb-4">
        <Link href="/app/courses" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{course.title}</h1>
      </div>

      {/* Cabecera del curso */}
      <Card className="overflow-hidden">
        <div className="h-48 bg-gray-200 relative">
          {course.image_url ? (
            <img
              src={course.image_url || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>
                {completedLessons} de {totalLessons} lecciones completadas
              </span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Lista de lecciones */}
      <div>
        <h2 className="text-xl font-bold mb-4">Lecciones</h2>

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(lesson.id)
            const isUnlocked = isLessonUnlocked(index)

            return (
              <Card key={lesson.id} className={`${!isUnlocked ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : !isUnlocked ? (
                          <Lock className="h-6 w-6 text-gray-400" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-xs text-gray-500">Lección {index + 1}</p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <Link href={`/app/courses/${course.id}/lessons/${lesson.id}`}>
                        <Button variant="outline" size="sm">
                          {isCompleted ? "Repasar" : "Comenzar"}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Bloqueado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
