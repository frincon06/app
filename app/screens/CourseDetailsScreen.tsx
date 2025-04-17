"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { supabase } from "../lib/supabase"
import type { Lesson, UserProgress } from "../types"
import { useAuth } from "../contexts/AuthContext"
import LessonCard from "../components/LessonCard"
import ProgressBar from "../components/ProgressBar"

export default function CourseDetailsScreen({ route, navigation }: { route: any; navigation: any }) {
  const { courseId, title } = route.params
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    navigation.setOptions({ title })
    fetchLessons()
    if (user) {
      fetchUserProgress()
    }
  }, [courseId])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true })

      if (error) throw error

      if (data) {
        setLessons(data)
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProgress = async () => {
    try {
      const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", user?.id)

      if (error) throw error

      if (data) {
        setUserProgress(data)
      }
    } catch (error) {
      console.error("Error fetching user progress:", error)
    }
  }

  const getLessonProgress = (lessonId: string) => {
    const progress = userProgress.find((p) => p.lesson_id === lessonId)
    return progress ? progress.completed : false
  }

  const calculateCourseProgress = () => {
    if (lessons.length === 0) return 0

    const completedLessons = lessons.filter((lesson) =>
      userProgress.some((p) => p.lesson_id === lesson.id && p.completed),
    ).length

    return (completedLessons / lessons.length) * 100
  }

  const isLessonLocked = (index: number) => {
    // First lesson is always unlocked
    if (index === 0) return false

    // Check if previous lesson is completed
    const prevLesson = lessons[index - 1]
    return !userProgress.some((p) => p.lesson_id === prevLesson.id && p.completed)
  }

  const handleLessonPress = (lesson: Lesson, index: number) => {
    if (isLessonLocked(index)) {
      // Show locked message
      return
    }

    navigation.navigate("LessonScreen", {
      lessonId: lesson.id,
      title: lesson.title,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Progreso del curso: {Math.round(calculateCourseProgress())}%</Text>
        <ProgressBar progress={calculateCourseProgress()} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Cargando lecciones...</Text>
        </View>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LessonCard
              lesson={item}
              isCompleted={getLessonProgress(item.id)}
              isLocked={isLessonLocked(index)}
              onPress={() => handleLessonPress(item, index)}
            />
          )}
          contentContainerStyle={styles.lessonsList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  progressContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  lessonsList: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
