"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  sort_order: number
  is_locked: boolean
}

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(5)

      if (error) throw error

      setCourses(data || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewCourse = (course: Course) => {
    router.push(`/dashboard/courses/${course.id}/lessons`)
  }

  if (loading) {
    return <p>Cargando cursos...</p>
  }

  if (courses.length === 0) {
    return <p>No hay cursos disponibles.</p>
  }

  return (
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

          <Button variant="outline" size="sm" onClick={() => handleViewCourse(course)}>
            Ver Lecciones
          </Button>
        </div>
      ))}

      <div className="text-center pt-2">
        <Button variant="link" onClick={() => router.push("/dashboard/courses")}>
          Ver todos los cursos
        </Button>
      </div>
    </div>
  )
}
