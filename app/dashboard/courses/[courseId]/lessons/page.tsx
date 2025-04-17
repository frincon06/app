"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, MoveUp, MoveDown, BookOpen, ArrowLeft } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import LessonForm from "@/components/dashboard/lesson-form"
import DeleteConfirmDialog from "@/components/dashboard/delete-confirm-dialog"

interface Lesson {
  id: string
  course_id: string
  title: string
  devotional_text: string
  sort_order: number
  is_locked: boolean
}

interface Course {
  id: string
  title: string
}

export default function LessonsPage({ params }: { params: { courseId: string } }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCourse()
    fetchLessons()
  }, [params.courseId])

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase.from("courses").select("id, title").eq("id", params.courseId).single()

      if (error) throw error

      setCourse(data)
    } catch (error) {
      console.error("Error fetching course:", error)
      router.push("/dashboard/courses")
    }
  }

  const fetchLessons = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", params.courseId)
        .order("sort_order", { ascending: true })

      if (error) throw error

      setLessons(data || [])
    } catch (error) {
      console.error("Error fetching lessons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLesson = () => {
    setEditingLesson(null)
    setIsFormOpen(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setIsFormOpen(true)
  }

  const handleDeleteLesson = (lesson: Lesson) => {
    setLessonToDelete(lesson)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return

    try {
      // Delete lesson
      const { error } = await supabase.from("lessons").delete().eq("id", lessonToDelete.id)

      if (error) throw error

      // Refresh lessons list
      fetchLessons()
    } catch (error) {
      console.error("Error deleting lesson:", error)
    } finally {
      setDeleteDialogOpen(false)
      setLessonToDelete(null)
    }
  }

  const handleMoveUp = async (lesson: Lesson) => {
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id)
    if (currentIndex <= 0) return

    const prevLesson = lessons[currentIndex - 1]

    try {
      // Update current lesson order
      await supabase.from("lessons").update({ sort_order: prevLesson.sort_order }).eq("id", lesson.id)

      // Update previous lesson order
      await supabase.from("lessons").update({ sort_order: lesson.sort_order }).eq("id", prevLesson.id)

      // Refresh lessons list
      fetchLessons()
    } catch (error) {
      console.error("Error moving lesson:", error)
    }
  }

  const handleMoveDown = async (lesson: Lesson) => {
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id)
    if (currentIndex >= lessons.length - 1) return

    const nextLesson = lessons[currentIndex + 1]

    try {
      // Update current lesson order
      await supabase.from("lessons").update({ sort_order: nextLesson.sort_order }).eq("id", lesson.id)

      // Update next lesson order
      await supabase.from("lessons").update({ sort_order: lesson.sort_order }).eq("id", nextLesson.id)

      // Refresh lessons list
      fetchLessons()
    } catch (error) {
      console.error("Error moving lesson:", error)
    }
  }

  const handleToggleLock = async (lesson: Lesson) => {
    try {
      await supabase.from("lessons").update({ is_locked: !lesson.is_locked }).eq("id", lesson.id)

      // Refresh lessons list
      fetchLessons()
    } catch (error) {
      console.error("Error toggling lesson lock:", error)
    }
  }

  const handleViewQuestions = (lesson: Lesson) => {
    router.push(`/dashboard/courses/${params.courseId}/lessons/${lesson.id}/questions`)
  }

  const handleBackToCourses = () => {
    router.push("/dashboard/courses")
  }

  return (
    <>
      <DashboardHeader
        title={`Lecciones: ${course?.title || ""}`}
        description="Administra las lecciones de este curso"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBackToCourses}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Cursos
            </Button>
            <Button onClick={handleAddLesson}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Lección
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Lecciones</CardTitle>
          <CardDescription>Lista de lecciones disponibles en este curso</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando lecciones...</p>
          ) : lessons.length === 0 ? (
            <p>No hay lecciones disponibles. Crea una nueva para comenzar.</p>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                      <BookOpen className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {lesson.devotional_text?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggleLock(lesson)}>
                      {lesson.is_locked ? "Desbloquear" : "Bloquear"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewQuestions(lesson)}>
                      Ver Preguntas
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveUp(lesson)}
                      disabled={lessons.indexOf(lesson) === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveDown(lesson)}
                      disabled={lessons.indexOf(lesson) === lessons.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditLesson(lesson)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteLesson(lesson)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <LessonForm
          lesson={editingLesson}
          courseId={params.courseId}
          onClose={() => setIsFormOpen(false)}
          onSaved={fetchLessons}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Lección"
        description={`¿Estás seguro de que deseas eliminar la lección "${lessonToDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteLesson}
      />
    </>
  )
}
