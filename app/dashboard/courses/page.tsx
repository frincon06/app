"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, MoveUp, MoveDown, BookOpen } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import CourseForm from "@/components/dashboard/course-form"
import DeleteConfirmDialog from "@/components/dashboard/delete-confirm-dialog"

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  sort_order: number
  is_locked: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("courses").select("*").order("sort_order", { ascending: true })

      if (error) throw error

      setCourses(data || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = () => {
    setEditingCourse(null)
    setIsFormOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setIsFormOpen(true)
  }

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return

    try {
      // Delete course
      const { error } = await supabase.from("courses").delete().eq("id", courseToDelete.id)

      if (error) throw error

      // Refresh courses list
      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
    } finally {
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    }
  }

  const handleMoveUp = async (course: Course) => {
    const currentIndex = courses.findIndex((c) => c.id === course.id)
    if (currentIndex <= 0) return

    const prevCourse = courses[currentIndex - 1]

    try {
      // Update current course order
      await supabase.from("courses").update({ sort_order: prevCourse.sort_order }).eq("id", course.id)

      // Update previous course order
      await supabase.from("courses").update({ sort_order: course.sort_order }).eq("id", prevCourse.id)

      // Refresh courses list
      fetchCourses()
    } catch (error) {
      console.error("Error moving course:", error)
    }
  }

  const handleMoveDown = async (course: Course) => {
    const currentIndex = courses.findIndex((c) => c.id === course.id)
    if (currentIndex >= courses.length - 1) return

    const nextCourse = courses[currentIndex + 1]

    try {
      // Update current course order
      await supabase.from("courses").update({ sort_order: nextCourse.sort_order }).eq("id", course.id)

      // Update next course order
      await supabase.from("courses").update({ sort_order: course.sort_order }).eq("id", nextCourse.id)

      // Refresh courses list
      fetchCourses()
    } catch (error) {
      console.error("Error moving course:", error)
    }
  }

  const handleToggleLock = async (course: Course) => {
    try {
      await supabase.from("courses").update({ is_locked: !course.is_locked }).eq("id", course.id)

      // Refresh courses list
      fetchCourses()
    } catch (error) {
      console.error("Error toggling course lock:", error)
    }
  }

  const handleViewLessons = (course: Course) => {
    router.push(`/dashboard/courses/${course.id}/lessons`)
  }

  return (
    <>
      <DashboardHeader
        title="Gestión de Cursos"
        description="Administra los cursos disponibles en la plataforma"
        actions={
          <Button onClick={handleAddCourse}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Curso
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>Lista de cursos disponibles en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando cursos...</p>
          ) : courses.length === 0 ? (
            <p>No hay cursos disponibles. Crea uno nuevo para comenzar.</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                      {course.image_url ? (
                        <img
                          src={course.image_url || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-md">{course.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggleLock(course)}>
                      {course.is_locked ? "Desbloquear" : "Bloquear"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewLessons(course)}>
                      Ver Lecciones
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveUp(course)}
                      disabled={courses.indexOf(course) === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveDown(course)}
                      disabled={courses.indexOf(course) === courses.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditCourse(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteCourse(course)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && <CourseForm course={editingCourse} onClose={() => setIsFormOpen(false)} onSaved={fetchCourses} />}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Curso"
        description={`¿Estás seguro de que deseas eliminar el curso "${courseToDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteCourse}
      />
    </>
  )
}
