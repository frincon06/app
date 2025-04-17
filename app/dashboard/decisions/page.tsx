"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"

interface Decision {
  id: string
  user_email: string
  decision_prompt: string
  response: string
  created_at: string
}

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDecisions()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDecisions(decisions)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredDecisions(
        decisions.filter(
          (decision) =>
            decision.user_email?.toLowerCase().includes(query) ||
            decision.decision_prompt?.toLowerCase().includes(query) ||
            decision.response?.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, decisions])

  const fetchDecisions = async () => {
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
      setFilteredDecisions(formattedDecisions || [])
    } catch (error) {
      console.error("Error fetching decisions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader title="Decisiones" description="Visualiza las decisiones tomadas por los usuarios" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Decisiones</CardTitle>
          <CardDescription>Busca decisiones por usuario, pregunta o respuesta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar decisiones..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Decisiones</CardTitle>
          <CardDescription>
            {filteredDecisions.length}{" "}
            {filteredDecisions.length === 1 ? "decisión encontrada" : "decisiones encontradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando decisiones...</p>
          ) : filteredDecisions.length === 0 ? (
            <p>No se encontraron decisiones.</p>
          ) : (
            <div className="space-y-4">
              {filteredDecisions.map((decision) => (
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
          )}
        </CardContent>
      </Card>
    </>
  )
}
