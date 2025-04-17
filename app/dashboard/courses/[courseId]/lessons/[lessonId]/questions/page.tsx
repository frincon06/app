"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, MoveUp, MoveDown, ArrowLeft } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import QuestionForm from "@/components/dashboard/question-form"
import DeleteConfirmDialog from "@/components/dashboard/delete-confirm-dialog"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  lesson_id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string
  sort_order: number
}

interface Lesson {
  id: string
  title: string
  course_id: string
}

export default function QuestionsPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchLesson()
    fetchQuestions()
  }, [params.lessonId])

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, course_id")
        .eq("id", params.lessonId)
        .single()

      if (error) throw error

      setLesson(data)
    } catch (error) {
      console.error("Error fetching lesson:", error)
      router.push(`/dashboard/courses/${params.courseId}/lessons`)
    }
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("lesson_id", params.lessonId)
        .order("sort_order", { ascending: true })

      if (error) throw error

      setQuestions(data || [])
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setIsFormOpen(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsFormOpen(true)
  }

  const handleDeleteQuestion = (question: Question) => {
    setQuestionToDelete(question)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return

    try {
      // Delete question
      const { error } = await supabase.from("questions").delete().eq("id", questionToDelete.id)

      if (error) throw error

      // Refresh questions list
      fetchQuestions()
    } catch (error) {
      console.error("Error deleting question:", error)
    } finally {
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    }
  }

  const handleMoveUp = async (question: Question) => {
    const currentIndex = questions.findIndex((q) => q.id === question.id)
    if (currentIndex <= 0) return

    const prevQuestion = questions[currentIndex - 1]

    try {
      // Update current question order
      await supabase.from("questions").update({ sort_order: prevQuestion.sort_order }).eq("id", question.id)

      // Update previous question order
      await supabase.from("questions").update({ sort_order: question.sort_order }).eq("id", prevQuestion.id)

      // Refresh questions list
      fetchQuestions()
    } catch (error) {
      console.error("Error moving question:", error)
    }
  }

  const handleMoveDown = async (question: Question) => {
    const currentIndex = questions.findIndex((q) => q.id === question.id)
    if (currentIndex >= questions.length - 1) return

    const nextQuestion = questions[currentIndex + 1]

    try {
      // Update current question order
      await supabase.from("questions").update({ sort_order: nextQuestion.sort_order }).eq("id", question.id)

      // Update next question order
      await supabase.from("questions").update({ sort_order: question.sort_order }).eq("id", nextQuestion.id)

      // Refresh questions list
      fetchQuestions()
    } catch (error) {
      console.error("Error moving question:", error)
    }
  }

  const handleBackToLessons = () => {
    router.push(`/dashboard/courses/${params.courseId}/lessons`)
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "Opción múltiple"
      case "true_false":
        return "Verdadero/Falso"
      case "fill_blank":
        return "Completar espacio"
      default:
        return type
    }
  }

  return (
    <>
      <DashboardHeader
        title={`Preguntas: ${lesson?.title || ""}`}
        description="Administra las preguntas de esta lección"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBackToLessons}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Lecciones
            </Button>
            <Button onClick={handleAddQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Pregunta
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Preguntas</CardTitle>
          <CardDescription>Lista de preguntas para esta lección</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando preguntas...</p>
          ) : questions.length === 0 ? (
            <p>No hay preguntas disponibles. Crea una nueva para comenzar.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className="mr-2">
                        {getQuestionTypeLabel(question.question_type)}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{question.question_text}</h3>
                    {question.question_type === "multiple_choice" && (
                      <div className="mt-2 space-y-1">
                        {Array.isArray(question.options) &&
                          question.options.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full mr-2 ${
                                  option === question.correct_answer ? "bg-green-500" : "bg-gray-200"
                                }`}
                              ></div>
                              <span className="text-sm">{option}</span>
                            </div>
                          ))}
                      </div>
                    )}
                    {question.question_type === "true_false" && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Respuesta correcta: </span>
                        {question.correct_answer === "true" ? "Verdadero" : "Falso"}
                      </div>
                    )}
                    {question.question_type === "fill_blank" && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Respuesta correcta: </span>
                        {question.correct_answer}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveUp(question)}
                      disabled={questions.indexOf(question) === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveDown(question)}
                      disabled={questions.indexOf(question) === questions.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditQuestion(question)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteQuestion(question)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <QuestionForm
          question={editingQuestion}
          lessonId={params.lessonId}
          onClose={() => setIsFormOpen(false)}
          onSaved={fetchQuestions}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Pregunta"
        description={`¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteQuestion}
      />
    </>
  )
}
