import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { LessonScreen } from "@/components/app/screens/lesson-screen"

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
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

  // Obtener la lección
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", params.lessonId)
    .eq("course_id", params.courseId)
    .single()

  if (!lesson) {
    redirect(`/app/courses/${params.courseId}`)
  }

  // Obtener las preguntas de la lección
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", params.lessonId)
    .order("sort_order", { ascending: true })

  // Obtener el progreso del usuario para esta lección
  const { data: lessonProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("lesson_id", params.lessonId)
    .single()

  return (
    <LessonScreen
      course={course}
      lesson={lesson}
      questions={questions || []}
      lessonProgress={lessonProgress}
      userId={session.user.id}
    />
  )
}
