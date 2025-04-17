"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Plus, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Question {
  id: string
  lesson_id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string
  sort_order: number
}

interface QuestionFormProps {
  question: Question | null
  lessonId: string
  onClose: () => void
  onSaved: () => void
}

export default function QuestionForm({ question, lessonId, onClose, onSaved }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState(question?.question_text || "")
  const [questionType, setQuestionType] = useState(question?.question_type || "multiple_choice")
  const [options, setOptions] = useState<string[]>(question?.options || ["", ""])
  const [correctAnswer, setCorrectAnswer] = useState(question?.correct_answer || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const isEditing = !!question

  useEffect(() => {
    // Initialize options based on question type
    if (questionType === "true_false") {
      setOptions(["true", "false"])
    } else if (questionType === "multiple_choice" && options.length < 2) {
      setOptions(["", ""])
    }
  }, [questionType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!questionText.trim()) {
        throw new Error("El texto de la pregunta es obligatorio")
      }

      if (questionType === "multiple_choice") {
        // Validate options
        const validOptions = options.filter((opt) => opt.trim() !== "")
        if (validOptions.length < 2) {
          throw new Error("Debes proporcionar al menos 2 opciones")
        }

        if (!correctAnswer) {
          throw new Error("Debes seleccionar una respuesta correcta")
        }
      } else if (questionType === "fill_blank" && !correctAnswer.trim()) {
        throw new Error("Debes proporcionar una respuesta correcta")
      }

      // Prepare data for saving
      const questionData = {
        question_text: questionText,
        question_type: questionType,
        options: questionType === "multiple_choice" ? options.filter((opt) => opt.trim() !== "") : [],
        correct_answer: correctAnswer,
      }

      if (isEditing) {
        // Update existing question
        const { error } = await supabase.from("questions").update(questionData).eq("id", question.id)

        if (error) throw error
      } else {
        // Get max order
        const { data: maxOrderData } = await supabase
          .from("questions")
          .select("sort_order")
          .eq("lesson_id", lessonId)
          .order("sort_order", { ascending: false })
          .limit(1)

        const maxOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].sort_order : 0

        // Create new question
        const { error } = await supabase.from("questions").insert({
          ...questionData,
          lesson_id: lessonId,
          sort_order: maxOrder + 1,
        })

        if (error) throw error
      }

      onSaved()
      onClose()
    } catch (err: any) {
      setError(err.message || "Error al guardar la pregunta")
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)

    // If the removed option was the correct answer, reset the correct answer
    if (options[index] === correctAnswer) {
      setCorrectAnswer("")
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)

    // If this option was the correct answer, update the correct answer
    if (options[index] === correctAnswer) {
      setCorrectAnswer(value)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Pregunta" : "Nueva Pregunta"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los detalles de la pregunta existente."
              : "Completa los detalles para crear una nueva pregunta."}
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
              <Label htmlFor="question_text">Texto de la Pregunta</Label>
              <Textarea
                id="question_text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="¿Cuál es tu pregunta?"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="question_type">Tipo de Pregunta</Label>
              <Select
                value={questionType}
                onValueChange={(value) => setQuestionType(value)}
                disabled={isEditing} // Don't allow changing question type when editing
              >
                <SelectTrigger id="question_type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Opción múltiple</SelectItem>
                  <SelectItem value="true_false">Verdadero/Falso</SelectItem>
                  <SelectItem value="fill_blank">Completar espacio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {questionType === "multiple_choice" && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Opciones</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                    <Plus className="h-4 w-4 mr-1" /> Añadir Opción
                  </Button>
                </div>

                <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option} id={`option-${index}`} disabled={!option.trim()} />
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {questionType === "true_false" && (
              <div className="grid gap-2">
                <Label>Respuesta Correcta</Label>
                <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true">Verdadero</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false">Falso</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {questionType === "fill_blank" && (
              <div className="grid gap-2">
                <Label htmlFor="correct_answer">Respuesta Correcta</Label>
                <Input
                  id="correct_answer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Respuesta correcta"
                  required
                />
              </div>
            )}
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
