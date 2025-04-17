import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"

interface DevotionalSectionProps {
  title: string
  content: string
  onNext: () => void
}

export default function DevotionalSection({ title, content, onNext }: DevotionalSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.content}>{content}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 16,
    padding: 16,
    minHeight: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  contentContainer: {
    maxHeight: 400,
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
