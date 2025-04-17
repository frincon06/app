import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import type { Course } from "../types"

interface CourseCardProps {
  course: Course
  onPress: () => void
}

export default function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, course.is_locked && styles.lockedContainer]}
      onPress={onPress}
      disabled={course.is_locked}
    >
      <Image source={{ uri: course.image_url || "https://via.placeholder.com/100" }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        {course.is_locked && (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>Bloqueado</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  lockedContainer: {
    opacity: 0.7,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  lockedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#f44336",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})
