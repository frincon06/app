import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import type { Lesson } from "../types"
import { Ionicons } from "@expo/vector-icons"

interface LessonCardProps {
  lesson: Lesson
  isCompleted: boolean
  isLocked: boolean
  onPress: () => void
}

export default function LessonCard({ lesson, isCompleted, isLocked, onPress }: LessonCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completedContainer, isLocked && styles.lockedContainer]}
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={styles.iconContainer}>
        {isCompleted ? (
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
        ) : isLocked ? (
          <Ionicons name="lock-closed" size={24} color="#999" />
        ) : (
          <Ionicons name="book-outline" size={24} color="#6200ee" />
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.completedText, isLocked && styles.lockedText]}>
          {lesson.title}
        </Text>

        {isCompleted && <Text style={styles.completedBadge}>Completado</Text>}

        {isLocked && <Text style={styles.lockedBadge}>Bloqueado</Text>}
      </View>

      <Ionicons name="chevron-forward" size={24} color={isLocked ? "#ccc" : "#6200ee"} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  completedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  lockedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  completedText: {
    color: "#4caf50",
  },
  lockedText: {
    color: "#999",
  },
  completedBadge: {
    fontSize: 12,
    color: "#4caf50",
    marginTop: 4,
  },
  lockedBadge: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
})
