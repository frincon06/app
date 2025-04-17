"use client"

import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  className?: string
}

export function LoadingSpinner({ size = "large", className }: LoadingSpinnerProps) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, className && styles.className]}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  className: {},
})
