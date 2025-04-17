"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface Course {
  id: string
  title: string
}

interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
}

interface Question {
  id: string
  lesson_id: string
  question_text: string
  options: string[]
  correct_answer: string
  explanation: string
  sort_order: number
}

interface UserProgress {
  id?: string
  user_id: string
  course_id: string
  lesson_id: string
  completed: boolean
  xp_earned: number
  created_at?: string
  updated_at?: string
}

interface LessonScreenProps {
  course: Course
  lesson: Lesson
  questions: Question[]
  lessonProgress: UserProgress | null
  userId: string
}

export function LessonScreen({ course, lesson, questions, lessonProgress, userId }: LessonScreenProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [isCorrect, setIsCorrect] = useState<Record<string, boolean>>({})
  const [isCompleted, setIsCompleted] = useState(lessonProgress?.completed || false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = questions.length + 1 // Contenido + preguntas

  // Manejar la selección de respuesta
  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (showResults[questionId]) return // No permitir cambios después de mostrar resultados

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  // Verificar respuesta
  const handleCheckAnswer = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const selected = selectedAnswers[questionId]
    if (!selected) return

    const correct = selected === question.correct_answer

    setIsCorrect((prev) => ({
      ...prev,
      [questionId]: correct,
    }))

    setShowResults((prev) => ({
      ...prev,
      [questionId]: true,
    }))
  }

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleCompleteLesson()
    }
  }

  // Retroceder al paso anterior
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Completar la lección
  const handleCompleteLesson = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // Calcular XP ganado (10 por cada respuesta correcta + 50 base)
      const correctAnswers = Object.values(isCorrect).filter(Boolean).length
      const xpEarned = correctAnswers * 10 + 50

      // Actualizar o crear progreso de usuario
      if (lessonProgress?.id) {
        await supabase
          .from("user_progress")
          .update({
            completed: true,
            xp_earned: xpEarned,
            updated_at: new Date().toISOString(),
          })
          .eq("id", lessonProgress.id)
      } else {
        await supabase.from("user_progress").insert({
          user_id: userId,
          course_id: course.id,
          lesson_id: lesson.id,
          completed: true,
          xp_earned: xpEarned,
        })
      }

      setIsCompleted(true)

      // Redirigir al detalle del curso
      router.push(`/app/courses/${course.id}`)
    } catch (error) {
      console.error("Error al completar la lección:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderizar el contenido de la lección
  const renderLessonContent = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{lesson.title}</h2>
        <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>
    )
  }

  // Renderizar una pregunta
  const renderQuestion = (question: Question) => {
    const questionId = question.id
    const selectedAnswer = selectedAnswers[questionId]
    const showResult = showResults[questionId]
    const isAnswerCorrect = isCorrect[questionId]

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{question.question_text}</h2>

        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectAnswer(questionId, option)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedAnswer === option ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-200 dark:border-gray-700"}
                ${showResult && selectedAnswer === option && isAnswerCorrect ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500" : ""}
                ${showResult && selectedAnswer === option && !isAnswerCorrect ? "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500" : ""}
                ${showResult && option === question.correct_answer && !isAnswerCorrect ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && option === question.correct_answer && <CheckCircle className="h-5 w-5 text-green-500" />}
                {showResult && selectedAnswer === option && option !== question.correct_answer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {showResult && (
          <div
            className={`p-4 rounded-lg ${isAnswerCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
          >
            <p
              className={`font-medium ${isAnswerCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
            >
              {isAnswerCorrect ? "¡Correcto!" : "¡Incorrecto!"}
            </p>
            <p className="mt-1">{question.explanation}</p>
          </div>
        )}

        {!showResult && selectedAnswer && (
          <Button onClick={() => handleCheckAnswer(questionId)} className="mt-4">
            Verificar respuesta
          </Button>
        )}
      </div>
    )
  }

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    if (currentStep === 0) {
      return renderLessonContent()
    } else {
      const questionIndex = currentStep - 1
      if (questionIndex < questions.length) {
        return renderQuestion(questions[questionIndex])
      }
    }

    return null
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/app/courses/${course.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">{course.title}</h1>
        <div className="w-9" /> {/* Espaciador para centrar el título */}
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1">
          <span>
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
      </div>

      {/* Contenido principal */}
      <Card>
        <CardContent className="p-6">{renderCurrentStep()}</CardContent>
      </Card>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
          Anterior
        </Button>

        <Button
          onClick={handleNextStep}
          disabled={
            isSubmitting ||
            (currentStep > 0 && currentStep <= questions.length && !showResults[questions[currentStep - 1]?.id])
          }
        >
          {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
          {currentStep < totalSteps - 1 ? "Siguiente" : "Completar"}
        </Button>
      </div>
    </div>
  )
}
