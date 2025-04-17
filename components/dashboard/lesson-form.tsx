"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RichTextEditor from "./rich-text-editor"

interface LessonFormProps {
  courseId: string
  lessonId?: string
  onSuccess?: () => void
}

export default function LessonForm({ courseId, lessonId, onSuccess }: LessonFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [title, setTitle] = useState("")
  const [devotionalText, setDevotionalText] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isEditing = !!lessonId

  useEffect(() => {
    if (lessonId) {
      fetchLessonData()
    }
  }, [lessonId])

  const fetchLessonData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("lessons").select("*").eq("id", lessonId).single()

      if (error) throw error

      if (data) {
        setTitle(data.title || "")
        setDevotionalText(data.devotional_text || "")
        setSortOrder(data.sort_order || 0)
        setIsLocked(data.is_locked || false)
      }
    } catch (error) {
      console.error("Error fetching lesson:", error)
      setError("Error al cargar la lección. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError("El título es obligatorio")
      return
    }

    try {
      setLoading(true)

      const lessonData = {
        title,
        devotional_text: devotionalText,
        sort_order: sortOrder,
        is_locked: isLocked,
        course_id: courseId,
      }

      let response

      if (isEditing) {
        // Update existing lesson
        response = await supabase.from("lessons").update(lessonData).eq("id", lessonId)
      } else {
        // Create new lesson
        response = await supabase.from("lessons").insert([lessonData])
      }

      if (response.error) throw response.error

      setSuccess(isEditing ? "Lección actualizada correctamente" : "Lección creada correctamente")

      if (onSuccess) {
        onSuccess()
      } else {
        // Redirect to lessons page after a short delay
        setTimeout(() => {
          router.push(`/dashboard/courses/${courseId}/lessons`)
          router.refresh()
        }, 1500)
      }
    } catch (error) {
      console.error("Error saving lesson:", error)
      setError("Error al guardar la lección. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Lección" : "Nueva Lección"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la lección"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="devotional_text">Contenido Devocional</Label>
            <RichTextEditor
              value={devotionalText}
              onChange={setDevotionalText}
              placeholder="Escribe el contenido devocional aquí..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Orden</Label>
            <Input
              id="sort_order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number.parseInt(e.target.value))}
              placeholder="Orden de la lección"
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="is_locked" checked={isLocked} onCheckedChange={(checked) => setIsLocked(!!checked)} />
            <Label htmlFor="is_locked">Lección bloqueada</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/courses/${courseId}/lessons`)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
