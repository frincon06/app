"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define theme colors
const lightTheme = {
  primary: "#5D3FD3", // Purple
  secondary: "#FFA500", // Orange
  background: "#FFFFFF",
  card: "#F9F9F9",
  text: "#333333",
  border: "#E0E0E0",
  notification: "#FF3B30",
  success: "#34C759",
  error: "#FF3B30",
  warning: "#FFCC00",
  info: "#5AC8FA",
}

const darkTheme = {
  primary: "#7B68EE", // Lighter purple for dark mode
  secondary: "#FFB347", // Lighter orange for dark mode
  background: "#121212",
  card: "#1E1E1E",
  text: "#F0F0F0",
  border: "#2C2C2C",
  notification: "#FF453A",
  success: "#30D158",
  error: "#FF453A",
  warning: "#FFD60A",
  info: "#64D2FF",
}

type Theme = {
  colors: typeof lightTheme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<Theme | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(colorScheme === "dark")

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme")
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark")
        }
      } catch (error) {
        console.log("Error loading theme preference:", error)
      }
    }

    loadThemePreference()
  }, [])

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.log("Error saving theme preference:", error)
    }
  }

  const theme = {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
    toggleTheme,
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
