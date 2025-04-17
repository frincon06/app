"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"

export default function XPIndicator() {
  const [xp, setXP] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchXP()
    }
  }, [user])

  const fetchXP = async () => {
    try {
      const { data, error } = await supabase.from("users").select("xp").eq("id", user?.id).single()

      if (error) throw error

      if (data) {
        setXP(data.xp || 0)
      }
    } catch (error) {
      console.error("Error fetching XP:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.xpText}>{xp} XP</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    color: "white",
    fontWeight: "bold",
  },
})
