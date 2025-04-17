"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Decision {
  id: string
  user_email: string
  decision_prompt: string
  response: string
  created_at: string
}

export default function RecentDecisions() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchRecentDecisions()
  }, [])

  const fetchRecentDecisions = async () => {
    try {
      setLoading(true)

      // Join user_decisions with users and decisions to get all the data we need
      const { data, error } = await supabase
        .from("user_decisions")
        .select(`
          id, 
          response, 
          created_at,
          users:user_id (email),
          decisions:decision_id (prompt)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error

      // Transform the data to match our Decision interface
      const formattedDecisions = data?.map((item) => ({
        id: item.id,
        user_email: item.users?.email || "Usuario desconocido",
        decision_prompt: item.decisions?.prompt || "Decisión sin prompt",
        response: item.response,
        created_at: item.created_at,
      }))

      setDecisions(formattedDecisions || [])
    } catch (error) {
      console.error("Error fetching recent decisions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Cargando decisiones recientes...</p>
  }

  if (decisions.length === 0) {
    return <p>No hay decisiones registradas.</p>
  }

  return (
    <div className="space-y-4">
      {decisions.map((decision) => (
        <div key={decision.id} className="p-4 border rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{decision.user_email}</span>
            <span className="text-xs text-gray-500">{new Date(decision.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm font-medium mb-1">Pregunta:</p>
          <p className="text-sm text-gray-600 mb-2">{decision.decision_prompt}</p>
          <p className="text-sm font-medium mb-1">Respuesta:</p>
          <p className="text-sm text-gray-600">{decision.response}</p>
        </div>
      ))}
    </div>
  )
}
