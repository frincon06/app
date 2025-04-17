"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { supabase } from "../../lib/supabase"
import Icon from "react-native-vector-icons/Ionicons"
import Card from "../../components/ui/Card"

export default function CoursesScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("courses").select("*").order("sort_order", { ascending: true })

      if (error) throw error
      setCourses(data || [])
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to load courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
      disabled={item.is_locked}
    >
      <Card style={[styles.courseCard, item.is_locked && styles.lockedCard]}>
        <View style={styles.courseHeader}>
          <View style={[styles.courseImagePlaceholder, { backgroundColor: colors.primary + "20" }]}>
            <Icon name={item.is_locked ? "lock-closed" : "book"} size={24} color={colors.primary} />
          </View>
          {item.is_locked && (
            <View style={[styles.lockedBadge, { backgroundColor: colors.error }]}>
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          )}
        </View>

        <Text style={[styles.courseTitle, { color: colors.text }]}>{item.title}</Text>

        <Text style={[styles.courseDescription, { color: colors.text + "CC" }]} numberOfLines={3}>
          {item.description || "Start your spiritual journey with this course"}
        </Text>

        <View style={styles.courseFooter}>
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Icon name="book-outline" size={16} color={colors.text + "CC"} />
              <Text style={[styles.statText, { color: colors.text + "CC" }]}>10 Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="time-outline" size={16} color={colors.text + "CC"} />
              <Text style={[styles.statText, { color: colors.text + "CC" }]}>2 Hours</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>All Courses</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={fetchCourses}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
  },
  courseCard: {
    marginBottom: 16,
  },
  lockedCard: {
    opacity: 0.7,
  },
  courseHeader: {
    position: "relative",
    marginBottom: 12,
  },
  courseImagePlaceholder: {
    height: 150,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  courseStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
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
})
