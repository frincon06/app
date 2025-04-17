"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"
import Icon from "react-native-vector-icons/Ionicons"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"

export default function QuestionScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { user } = useAuth()
  const { lessonId, courseId } = route.params

  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchQuestions()
  }, [lessonId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("sort_order", { ascending: true })

      if (error) throw error
      setQuestions(data || [])

      // Calculate initial progress
      setProgress(0)
    } catch (err) {
      console.error("Error fetching questions:", err)
      setError("Failed to load questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const checkAnswer = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer

    setIsCorrect(isAnswerCorrect)
    setIsAnswerChecked(true)

    if (isAnswerCorrect) {
      setScore(score + 1)
    }
  }

  const nextQuestion = async () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setProgress((currentQuestionIndex + 1) / questions.length)
    } else {
      // Last question completed, save progress
      try {
        // Check if progress record exists
        const { data: existingProgress, error: checkError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .single()

        if (checkError && checkError.code !== "PGRST116") {
          throw checkError
        }

        const calculatedScore = Math.round((score / questions.length) * 100)

        if (existingProgress) {
          // Update existing progress
          await supabase
            .from("user_progress")
            .update({
              completed: true,
              score: calculatedScore,
              completed_at: new Date().toISOString(),
            })
            .eq("id", existingProgress.id)
        } else {
          // Create new progress record
          await supabase.from("user_progress").insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            score: calculatedScore,
            completed_at: new Date().toISOString(),
          })
        }

        // Add XP to user
        await supabase.rpc("increment_user_xp", {
          user_id: user.id,
          xp_amount: 50,
        })

        // Navigate to completion screen
        navigation.navigate("Completion", {
          score: calculatedScore,
          totalQuestions: questions.length,
          correctAnswers: score,
          lessonId,
          courseId,
        })
      } catch (err) {
        console.error("Error saving progress:", err)
        // Still navigate to completion even if saving fails
        navigation.navigate("Completion", {
          score: Math.round((score / questions.length) * 100),
          totalQuestions: questions.length,
          correctAnswers: score,
          lessonId,
          courseId,
        })
      }
    }
  }

  const renderOptions = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return null

    let options = []

    if (currentQuestion.question_type === "multiple_choice") {
      options = currentQuestion.options || []
    } else if (currentQuestion.question_type === "true_false") {
      options = ["True", "False"]
    }

    return options.map((option, index) => {
      const isSelected = selectedAnswer === option
      const showResult = isAnswerChecked
      const isCorrectOption = option === currentQuestion.correct_answer

      let backgroundColor = colors.card
      if (showResult) {
        if (isSelected && isCorrectOption) {
          backgroundColor = colors.success + "20"
        } else if (isSelected && !isCorrectOption) {
          backgroundColor = colors.error + "20"
        } else if (isCorrectOption) {
          backgroundColor = colors.success + "20"
        }
      } else if (isSelected) {
        backgroundColor = colors.primary + "20"
      }

      return (
        <TouchableOpacity
          key={index}
          style={[styles.optionButton, { backgroundColor, borderColor: colors.border }]}
          onPress={() => !isAnswerChecked && setSelectedAnswer(option)}
          disabled={isAnswerChecked}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>

          {showResult && isCorrectOption && <Icon name="checkmark-circle" size={24} color={colors.success} />}

          {showResult && isSelected && !isCorrectOption && <Icon name="close-circle" size={24} color={colors.error} />}
        </TouchableOpacity>
      )
    })
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={fetchQuestions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Questions</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No questions available for this lesson.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} style={styles.emptyButton} />
        </View>
      </SafeAreaView>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${(currentQuestionIndex / questions.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.questionCard}>
          <Text style={[styles.questionText, { color: colors.text }]}>{currentQuestion?.question_text}</Text>
        </Card>

        <View style={styles.optionsContainer}>{renderOptions()}</View>

        {isAnswerChecked ? (
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackText, { color: isCorrect ? colors.success : colors.error }]}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </Text>
            <Button
              title={currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Lesson"}
              onPress={nextQuestion}
              style={styles.nextButton}
            />
          </View>
        ) : (
          <Button title="Check Answer" onPress={checkAnswer} disabled={!selectedAnswer} style={styles.checkButton} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  progressBar: {
    height: 6,
    width: "100%",
  },
  progressFill: {
    height: "100%",
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  questionCard: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
  },
  feedbackContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  nextButton: {
    width: "100%",
  },
  checkButton: {
    width: "100%",
    marginTop: "auto",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    width: 120,
  },
})
