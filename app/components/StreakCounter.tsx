"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchStreak()
    }
  }, [user])

  const fetchStreak = async () => {
    try {
      const { data, error } = await supabase.from("users").select("streak_days").eq("id", user?.id).single()

      if (error) throw error

      if (data) {
        setStreak(data.streak_days || 0)
      }
    } catch (error) {
      console.error("Error fetching streak:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={20} color="#ff9800" />
      <Text style={styles.streakText}>{streak}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  streakText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
  },
})
