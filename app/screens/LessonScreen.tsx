"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import type { Lesson, Question, Decision, Activity } from "../types"
import DevotionalSection from "../components/DevotionalSection"
import QuestionSection from "../components/QuestionSection"
import DecisionSection from "../components/DecisionSection"
import ActivitySection from "../components/ActivitySection"

export default function LessonScreen({ route, navigation }: { route: any; navigation: any }) {
  const { lessonId, title } = route.params
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [decision, setDecision] = useState<Decision | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState<
    "devotional" | "questions" | "decision" | "activities" | "complete"
  >("devotional")
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    navigation.setOptions({ title })
    fetchLessonData()
  }, [lessonId])

  const fetchLessonData = async () => {
    try {
      setLoading(true)

      // Fetch lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single()

      if (lessonError) throw lessonError
      setLesson(lessonData)

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("order", { ascending: true })

      if (questionsError) throw questionsError
      setQuestions(questionsData || [])

      // Fetch decision
      const { data: decisionData, error: decisionError } = await supabase
        .from("decisions")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("is_enabled", true)
        .single()

      if (!decisionError) {
        setDecision(decisionData)
      }

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .eq("lesson_id", lessonId)

      if (activitiesError) throw activitiesError
      setActivities(activitiesData || [])
    } catch (error) {
      console.error("Error fetching lesson data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelected = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextSection = async () => {
    if (currentSection === "devotional") {
      setCurrentSection("questions")
    } else if (currentSection === "questions") {
      // Calculate score
      let correctAnswers = 0
      questions.forEach((question) => {
        if (userAnswers[question.id] === question.correct_answer) {
          correctAnswers++
        }
      })

      const calculatedScore = Math.round((correctAnswers / questions.length) * 100)
      setScore(calculatedScore)

      // Move to next section
      if (decision && decision.is_enabled) {
        setCurrentSection("decision")
      } else if (activities.length > 0) {
        setCurrentSection("activities")
      } else {
        setCurrentSection("complete")
        await completeLesson(calculatedScore)
      }
    } else if (currentSection === "decision") {
      if (activities.length > 0) {
        setCurrentSection("activities")
      } else {
        setCurrentSection("complete")
        await completeLesson(score)
      }
    } else if (currentSection === "activities") {
      setCurrentSection("complete")
      await completeLesson(score)
    }
  }

  const handleDecisionSubmit = async (response: string) => {
    if (!user || !decision) return

    try {
      await supabase.from("user_decisions").insert({
        user_id: user.id,
        decision_id: decision.id,
        response,
      })
    } catch (error) {
      console.error("Error saving decision:", error)
    }
  }

  const completeLesson = async (finalScore: number) => {
    if (!user) return

    try {
      // Save lesson progress
      await supabase.from("user_progress").upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        score: finalScore,
        completed_at: new Date().toISOString(),
      })

      // Add XP to user
      const xpToAdd = Math.round(finalScore / 10)
      await supabase.rpc("increment_user_xp", {
        user_id: user.id,
        xp_amount: xpToAdd,
      })
    } catch (error) {
      console.error("Error completing lesson:", error)
    }
  }

  const handleFinish = () => {
    navigation.goBack()
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando lección...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {currentSection === "devotional" && lesson && (
        <DevotionalSection title={lesson.title} content={lesson.devotional_text} onNext={handleNextSection} />
      )}

      {currentSection === "questions" && (
        <QuestionSection
          questions={questions}
          userAnswers={userAnswers}
          onAnswerSelected={handleAnswerSelected}
          onComplete={handleNextSection}
        />
      )}

      {currentSection === "decision" && decision && (
        <DecisionSection prompt={decision.prompt} onSubmit={handleDecisionSubmit} onNext={handleNextSection} />
      )}

      {currentSection === "activities" && <ActivitySection activities={activities} onComplete={handleNextSection} />}

      {currentSection === "complete" && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>¡Lección Completada!</Text>
          <Text style={styles.scoreText}>Puntuación: {score}%</Text>
          <Text style={styles.xpText}>+{Math.round(score / 10)} XP</Text>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completeContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 8,
  },
  xpText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 24,
  },
  finishButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
