import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { CoursesScreen } from "@/components/app/screens/courses-screen"

export default async function CoursesPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener los cursos
  const { data: courses } = await supabase.from("courses").select("*").order("sort_order", { ascending: true })

  // Obtener el progreso del usuario
  const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", session.user.id)

  return <CoursesScreen courses={courses || []} userProgress={userProgress || []} />
}
