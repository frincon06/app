"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Award, Flame } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"

interface User {
  id: string
  email: string
  name: string
  role: string
  xp: number
  streak_days: number
  last_activity: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(query) ||
            user.name?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("users").select("*").order("xp", { ascending: false })

      if (error) throw error

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMakeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase.from("users").update({ role: "admin" }).eq("id", userId)

      if (error) throw error

      // Refresh users list
      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const { error } = await supabase.from("users").update({ role: "user" }).eq("id", userId)

      if (error) throw error

      // Refresh users list
      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  return (
    <>
      <DashboardHeader title="Usuarios" description="Administra los usuarios de la plataforma" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Usuarios</CardTitle>
          <CardDescription>Busca usuarios por nombre, correo o rol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar usuarios..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} {filteredUsers.length === 1 ? "usuario encontrado" : "usuarios encontrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : filteredUsers.length === 0 ? (
            <p>No se encontraron usuarios.</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium">{user.name || "Usuario sin nombre"}</h3>
                      {user.role === "admin" && (
                        <Badge className="ml-2" variant="outline">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{user.xp || 0} XP</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Flame className="h-4 w-4 mr-1" />
                        <span>{user.streak_days || 0} días</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {user.role === "admin" ? (
                      <Button variant="outline" size="sm" onClick={() => handleRemoveAdmin(user.id)}>
                        Quitar Admin
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleMakeAdmin(user.id)}>
                        Hacer Admin
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
