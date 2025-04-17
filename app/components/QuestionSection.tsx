"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import type { Question } from "../types"

interface QuestionSectionProps {
  questions: Question[]
  userAnswers: Record<string, string>
  onAnswerSelected: (questionId: string, answer: string) => void
  onComplete: () => void
}

export default function QuestionSection({
  questions,
  userAnswers,
  onAnswerSelected,
  onComplete,
}: QuestionSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnsweredCurrent = userAnswers[currentQuestion?.id] !== undefined

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return // Prevent changing answer during feedback

    onAnswerSelected(currentQuestion.id, answer)
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)

    if (isLastQuestion) {
      onComplete()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const isCorrectAnswer = (answer: string) => {
    return answer === currentQuestion.correct_answer
  }

  const isSelectedAnswer = (answer: string) => {
    return userAnswers[currentQuestion?.id] === answer
  }

  if (!currentQuestion) return null

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
      </View>

      <Text style={styles.questionCount}>
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </Text>

      <Text style={styles.questionText}>{currentQuestion.question_text}</Text>

      <View style={styles.optionsContainer}>
        {currentQuestion.question_type === "multiple_choice" &&
          currentQuestion.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelectedAnswer(option) && styles.selectedOption,
                showFeedback && isCorrectAnswer(option) && styles.correctOption,
                showFeedback && isSelectedAnswer(option) && !isCorrectAnswer(option) && styles.incorrectOption,
              ]}
              onPress={() => handleAnswerSelect(option)}
              disabled={showFeedback}
            >
              <Text
                style={[
                  styles.optionText,
                  showFeedback && isCorrectAnswer(option) && styles.correctOptionText,
                  showFeedback && isSelectedAnswer(option) && !isCorrectAnswer(option) && styles.incorrectOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}

        {currentQuestion.question_type === "true_false" && (
          <>
            <TouchableOpacity
              style={[
                styles.optionButton,
                isSelectedAnswer("true") && styles.selectedOption,
                showFeedback && isCorrectAnswer("true") && styles.correctOption,
                showFeedback && isSelectedAnswer("true") && !isCorrectAnswer("true") && styles.incorrectOption,
              ]}
              onPress={() => handleAnswerSelect("true")}
              disabled={showFeedback}
            >
              <Text
                style={[
                  styles.optionText,
                  showFeedback && isCorrectAnswer("true") && styles.correctOptionText,
                  showFeedback && isSelectedAnswer("true") && !isCorrectAnswer("true") && styles.incorrectOptionText,
                ]}
              >
                Verdadero
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                isSelectedAnswer("false") && styles.selectedOption,
                showFeedback && isCorrectAnswer("false") && styles.correctOption,
                showFeedback && isSelectedAnswer("false") && !isCorrectAnswer("false") && styles.incorrectOption,
              ]}
              onPress={() => handleAnswerSelect("false")}
              disabled={showFeedback}
            >
              <Text
                style={[
                  styles.optionText,
                  showFeedback && isCorrectAnswer("false") && styles.correctOptionText,
                  showFeedback && isSelectedAnswer("false") && !isCorrectAnswer("false") && styles.incorrectOptionText,
                ]}
              >
                Falso
              </Text>
            </TouchableOpacity>
          </>
        )}

        {currentQuestion.question_type === "fill_blank" && <Text>Implementación de completar espacios en blanco</Text>}
      </View>

      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              isCorrectAnswer(userAnswers[currentQuestion.id]) ? styles.correctFeedback : styles.incorrectFeedback,
            ]}
          >
            {isCorrectAnswer(userAnswers[currentQuestion.id])
              ? "¡Correcto!"
              : `Incorrecto. La respuesta correcta es: ${currentQuestion.correct_answer}`}
          </Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{isLastQuestion ? "Finalizar" : "Siguiente"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#6200ee",
    borderRadius: 4,
  },
  questionCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 24,
    color: "#333",
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    borderColor: "#6200ee",
    backgroundColor: "#f3e5f5",
  },
  correctOption: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
  },
  incorrectOption: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  correctOptionText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  incorrectOptionText: {
    color: "#f44336",
  },
  feedbackContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  correctFeedback: {
    color: "#4caf50",
  },
  incorrectFeedback: {
    color: "#f44336",
  },
  nextButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
