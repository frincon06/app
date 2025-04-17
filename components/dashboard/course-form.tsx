"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  sort_order: number
  is_locked: boolean
}

interface CourseFormProps {
  course: Course | null
  onClose: () => void
  onSaved: () => void
}

export default function CourseForm({ course, onClose, onSaved }: CourseFormProps) {
  const [title, setTitle] = useState(course?.title || "")
  const [description, setDescription] = useState(course?.description || "")
  const [imageUrl, setImageUrl] = useState(course?.image_url || "")
  const [isLocked, setIsLocked] = useState(course?.is_locked || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const isEditing = !!course

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!title.trim()) {
        throw new Error("El título es obligatorio")
      }

      if (isEditing) {
        // Update existing course
        const { error } = await supabase
          .from("courses")
          .update({
            title,
            description,
            image_url: imageUrl,
            is_locked: isLocked,
          })
          .eq("id", course.id)

        if (error) throw error
      } else {
        // Get max order
        const { data: maxOrderData } = await supabase
          .from("courses")
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1)

        const maxOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].sort_order : 0

        // Create new course
        const { error } = await supabase.from("courses").insert({
          title,
          description,
          image_url: imageUrl,
          is_locked: isLocked,
          sort_order: maxOrder + 1,
        })

        if (error) throw error
      }

      onSaved()
      onClose()
    } catch (err: any) {
      setError(err.message || "Error al guardar el curso")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Curso" : "Nuevo Curso"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los detalles del curso existente."
              : "Completa los detalles para crear un nuevo curso."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del curso"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del curso"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">URL de la imagen</Label>
              <Input
                id="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="is_locked" checked={isLocked} onCheckedChange={setIsLocked} />
              <Label htmlFor="is_locked">Curso bloqueado</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
