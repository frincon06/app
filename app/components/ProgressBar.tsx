import { View, StyleSheet } from "react-native"

interface ProgressBarProps {
  progress: number // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <View style={styles.container}>
      <View style={[styles.progressFill, { width: `${clampedProgress}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6200ee",
    borderRadius: 4,
  },
})
