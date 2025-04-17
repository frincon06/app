"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/AuthContext"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Icon from "react-native-vector-icons/Ionicons"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { user } = useAuth()

  const [userData, setUserData] = useState(null)
  const [courses, setCourses] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (userError) throw userError
      setUserData(userData)

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(3)

      if (coursesError) throw coursesError
      setCourses(coursesData)

      // Fetch current lesson (most recent incomplete lesson)
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select(`
          *,
          lesson:lessons(
            *,
            course:courses(*)
          )
        `)
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("created_at", { ascending: true })
        .limit(1)

      if (progressError) throw progressError

      if (progressData && progressData.length > 0) {
        setCurrentLesson(progressData[0].lesson)
      } else {
        // If no incomplete lesson, get the first lesson of the first course
        if (coursesData && coursesData.length > 0) {
          const { data: lessonData, error: lessonError } = await supabase
            .from("lessons")
            .select("*")
            .eq("course_id", coursesData[0].id)
            .order("sort_order", { ascending: true })
            .limit(1)

          if (lessonError) throw lessonError

          if (lessonData && lessonData.length > 0) {
            setCurrentLesson({
              ...lessonData[0],
              course: coursesData[0],
            })
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Hello, {userData?.name || "Friend"}!</Text>
            <Text style={[styles.subtitle, { color: colors.text + "CC" }]}>Continue your spiritual journey</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: colors.primary + "20" }]}>
              <Icon name="flame" size={20} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{userData?.streak_days || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.text + "CC" }]}>Day Streak</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.secondary + "20" }]}>
              <Icon name="star" size={20} color={colors.secondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{userData?.xp || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.text + "CC" }]}>XP Points</Text>
            </View>
          </View>
        </View>

        {/* Continue Learning Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
          {currentLesson ? (
            <Card style={styles.continueCard}>
              <View style={styles.continueCardContent}>
                <View style={styles.continueCardInfo}>
                  <Text style={[styles.continueCardCourse, { color: colors.primary }]}>
                    {currentLesson.course?.title || "Course"}
                  </Text>
                  <Text style={[styles.continueCardTitle, { color: colors.text }]}>{currentLesson.title}</Text>
                  <Text style={[styles.continueCardDescription, { color: colors.text + "CC" }]} numberOfLines={2}>
                    {currentLesson.devotional_text?.substring(0, 100) || "Continue your Bible study journey"}...
                  </Text>
                </View>
                <Button
                  title="Continue"
                  onPress={() =>
                    navigation.navigate("Lesson", {
                      lessonId: currentLesson.id,
                      courseId: currentLesson.course_id,
                    })
                  }
                  size="small"
                />
              </View>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyCardText, { color: colors.text }]}>No lessons in progress</Text>
              <Button
                title="Start Learning"
                onPress={() => navigation.navigate("Courses")}
                size="small"
                style={styles.emptyCardButton}
              />
            </Card>
          )}
        </View>

        {/* Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.coursesList}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate("CourseDetail", { courseId: course.id })}
              >
                <View style={[styles.courseImagePlaceholder, { backgroundColor: colors.primary + "20" }]}>
                  <Icon name="book" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={[styles.courseDescription, { color: colors.text + "CC" }]} numberOfLines={2}>
                  {course.description || "Start your spiritual journey"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Verse Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Verse</Text>
          <Card style={styles.verseCard}>
            <Text style={[styles.verseText, { color: colors.text }]}>
              "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not
              perish but have eternal life."
            </Text>
            <Text style={[styles.verseReference, { color: colors.primary }]}>John 3:16</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  continueCard: {
    padding: 0,
    overflow: "hidden",
  },
  continueCardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continueCardInfo: {
    flex: 1,
    marginRight: 16,
  },
  continueCardCourse: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  continueCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  continueCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyCardText: {
    marginBottom: 16,
    fontSize: 16,
  },
  emptyCardButton: {
    minWidth: 120,
  },
  coursesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  courseCard: {
    width: "48%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  courseImagePlaceholder: {
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  verseCard: {
    alignItems: "center",
    padding: 24,
  },
  verseText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 24,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: "bold",
  },
})
