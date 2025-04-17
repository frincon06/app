import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { AchievementsScreen } from "@/components/app/screens/achievements-screen"

export default async function AchievementsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener progreso del usuario
  const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", session.user.id)

  return <AchievementsScreen userProgress={userProgress || []} />
}
