"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Share } from "react-native"
import type { Activity } from "../types"
import { Ionicons } from "@expo/vector-icons"

interface ActivitySectionProps {
  activities: Activity[]
  onComplete: () => void
}

export default function ActivitySection({ activities, onComplete }: ActivitySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const currentActivity = activities[currentIndex]
  const isLastActivity = currentIndex === activities.length - 1
  const allCompleted =
    activities.length === 0 || activities.every((activity) => completed[activity.id] || !activity.is_required)

  const handleNext = () => {
    if (isLastActivity || allCompleted) {
      onComplete()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const markAsCompleted = (activityId: string) => {
    setCompleted((prev) => ({
      ...prev,
      [activityId]: true,
    }))
  }

  const handleShare = async (content: string) => {
    try {
      await Share.share({
        message: content,
      })
      markAsCompleted(currentActivity.id)
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  if (!currentActivity) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay actividades disponibles</Text>
        <TouchableOpacity style={styles.nextButton} onPress={onComplete}>
          <Text style={styles.nextButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actividad Espiritual</Text>
      <Text style={styles.activityCount}>
        {currentIndex + 1} de {activities.length}
      </Text>

      {currentActivity.activity_type === "memorize_verse" && (
        <View style={styles.verseContainer}>
          <Text style={styles.verseLabel}>Memoriza este versículo:</Text>
          <Text style={styles.verseText}>{currentActivity.content}</Text>

          <TouchableOpacity
            style={[styles.actionButton, completed[currentActivity.id] && styles.completedButton]}
            onPress={() => markAsCompleted(currentActivity.id)}
            disabled={completed[currentActivity.id]}
          >
            <Text style={styles.actionButtonText}>
              {completed[currentActivity.id] ? "Memorizado ✓" : "Marcar como memorizado"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {currentActivity.activity_type === "prayer" && (
        <View style={styles.prayerContainer}>
          <Text style={styles.prayerLabel}>Momento de oración:</Text>
          <Text style={styles.prayerText}>{currentActivity.content}</Text>

          <TextInput style={styles.prayerInput} placeholder="Escribe tu oración aquí (opcional)" multiline />

          <TouchableOpacity
            style={[styles.actionButton, completed[currentActivity.id] && styles.completedButton]}
            onPress={() => markAsCompleted(currentActivity.id)}
            disabled={completed[currentActivity.id]}
          >
            <Text style={styles.actionButtonText}>
              {completed[currentActivity.id] ? "Oración completada ✓" : "He orado"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {currentActivity.activity_type === "share" && (
        <View style={styles.shareContainer}>
          <Text style={styles.shareLabel}>Comparte este mensaje:</Text>
          <Text style={styles.shareText}>{currentActivity.content}</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton, completed[currentActivity.id] && styles.completedButton]}
            onPress={() => handleShare(currentActivity.content)}
            disabled={completed[currentActivity.id]}
          >
            <Ionicons name="share-outline" size={18} color="white" style={styles.shareIcon} />
            <Text style={styles.actionButtonText}>{completed[currentActivity.id] ? "Compartido ✓" : "Compartir"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.navigationContainer}>
        {!isLastActivity && (
          <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
            <Text style={styles.skipButtonText}>{currentActivity.is_required ? "Omitir" : "Siguiente"}</Text>
          </TouchableOpacity>
        )}

        {(completed[currentActivity.id] || !currentActivity.is_required) && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{isLastActivity ? "Finalizar" : "Siguiente"}</Text>
          </TouchableOpacity>
        )}
      </View>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  activityCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  verseContainer: {
    marginBottom: 24,
  },
  verseLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  verseText: {
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 26,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  prayerContainer: {
    marginBottom: 24,
  },
  prayerLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  prayerText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: "#333",
  },
  prayerInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  shareContainer: {
    marginBottom: 24,
  },
  shareLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  shareText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: "#333",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  actionButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  completedButton: {
    backgroundColor: "#4caf50",
  },
  shareButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  shareIcon: {
    marginRight: 8,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#6200ee",
  },
  skipButtonText: {
    color: "#6200ee",
    fontSize: 16,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
