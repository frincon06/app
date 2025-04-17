import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { CourseDetailScreen } from "@/components/app/screens/course-detail-screen"

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener el curso
  const { data: course } = await supabase.from("courses").select("*").eq("id", params.courseId).single()

  if (!course) {
    redirect("/app/courses")
  }

  // Obtener las lecciones del curso
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", params.courseId)
    .order("sort_order", { ascending: true })

  // Obtener el progreso del usuario
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("course_id", params.courseId)

  return (
    <CourseDetailScreen
      course={course}
      lessons={lessons || []}
      userProgress={userProgress || []}
      userId={session.user.id}
    />
  )
}
