import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { HomeScreen } from "@/components/app/screens/home-screen"

export default async function AppHomePage() {
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

  return <HomeScreen courses={courses || []} userProgress={userProgress || []} userId={session.user.id} />
}
