import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/app")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-700">Sagrapp</h1>
          <p className="mt-2 text-gray-600">Estudio Bíblico Gamificado</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
