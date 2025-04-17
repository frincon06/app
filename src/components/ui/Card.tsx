"use client"

import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevation?: number
}

const Card: React.FC<CardProps> = ({ children, style, elevation = 2 }) => {
  const { colors, isDark } = useTheme()

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0.1 : 0.1,
          elevation: isDark ? 0 : elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginVertical: 8,
  },
})

export default Card
