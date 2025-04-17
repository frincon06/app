"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import type { Course } from "../types"
import StreakCounter from "../components/StreakCounter"
import XPIndicator from "../components/XPIndicator"
import CourseCard from "../components/CourseCard"

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchCourses()
    updateStreak()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("courses").select("*").order("order", { ascending: true })

      if (error) throw error

      if (data) {
        setCourses(data)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStreak = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split("T")[0]

      // Get user's last activity
      const { data: userData } = await supabase
        .from("users")
        .select("last_activity, streak_days")
        .eq("id", user.id)
        .single()

      if (userData) {
        const lastActivity = userData.last_activity
          ? new Date(userData.last_activity).toISOString().split("T")[0]
          : null
        let newStreak = userData.streak_days || 0

        // If last activity was yesterday, increment streak
        if (lastActivity) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split("T")[0]

          if (lastActivity === yesterdayStr) {
            newStreak += 1
          } else if (lastActivity !== today) {
            // Reset streak if not yesterday and not today
            newStreak = 1
          }
        } else {
          // First activity
          newStreak = 1
        }

        // Update user streak and last activity
        await supabase
          .from("users")
          .update({
            streak_days: newStreak,
            last_activity: new Date().toISOString(),
          })
          .eq("id", user.id)
      }
    } catch (error) {
      console.error("Error updating streak:", error)
    }
  }

  const handleCoursePress = (course: Course) => {
    navigation.navigate("CourseDetails", { courseId: course.id, title: course.title })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sagrapp</Text>
        <View style={styles.statsContainer}>
          <StreakCounter />
          <XPIndicator />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cursos Bíblicos</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Cargando cursos...</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CourseCard course={item} onPress={() => handleCoursePress(item)} />}
          contentContainerStyle={styles.coursesList}
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
  header: {
    padding: 16,
    backgroundColor: "#6200ee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
    color: "#333",
  },
  coursesList: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
