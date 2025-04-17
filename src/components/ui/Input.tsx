"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity, type TextInputProps, type ViewStyle } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import Icon from "react-native-vector-icons/Ionicons"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  containerStyle?: ViewStyle
  isPassword?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  isPassword = false,
  ...rest
}) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        {leftIcon && <Icon name={leftIcon} size={20} color={colors.text} style={styles.leftIcon} />}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 12,
            },
          ]}
          placeholderTextColor={colors.text + "80"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIcon}>
            <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color={colors.text} />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Icon name={rightIcon} size={20} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
  },
  leftIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  rightIcon: {
    paddingRight: 12,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
})

export default Input
