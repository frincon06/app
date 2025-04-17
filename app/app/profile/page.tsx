import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ProfileScreen } from "@/components/app/screens/profile-screen"

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener datos del usuario
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  // Obtener progreso del usuario
  const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", session.user.id)

  // Obtener actividades del usuario
  const { data: userActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <ProfileScreen
      user={session.user}
      userData={userData || {}}
      userProgress={userProgress || []}
      userActivities={userActivities || []}
    />
  )
}
