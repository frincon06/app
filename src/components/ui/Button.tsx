"use client"

import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
} from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface ButtonProps extends TouchableOpacityProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "small" | "medium" | "large"
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const { colors, isDark } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return colors.border

    switch (variant) {
      case "primary":
        return colors.primary
      case "secondary":
        return colors.secondary
      case "outline":
      case "text":
        return "transparent"
      default:
        return colors.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return isDark ? colors.text : "#888"

    switch (variant) {
      case "primary":
      case "secondary":
        return "#FFFFFF"
      case "outline":
        return colors.primary
      case "text":
        return colors.primary
      default:
        return "#FFFFFF"
    }
  }

  const getBorderColor = () => {
    if (disabled) return colors.border

    switch (variant) {
      case "outline":
        return colors.primary
      default:
        return "transparent"
    }
  }

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 }
      case "medium":
        return { paddingVertical: 12, paddingHorizontal: 24 }
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 32 }
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 }
    }
  }

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 14
      case "medium":
        return 16
      case "large":
        return 18
      default:
        return 16
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 2 : 0,
          ...getPadding(),
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
})

export default Button
