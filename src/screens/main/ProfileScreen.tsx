"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"
import Icon from "react-native-vector-icons/Ionicons"
import Button from "../../components/ui/Button"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { colors, toggleTheme, isDark } = useTheme()
  const { user, signOut } = useAuth()

  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalXP: 0,
    streak: 0,
    averageScore: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Fetch user data
      const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (userError) throw userError
      setUserData(userData)

      // Fetch user progress stats
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)

      if (progressError) throw progressError

      const completedLessons = progressData.filter((p) => p.completed).length
      const totalScores = progressData.reduce((sum, p) => sum + (p.score || 0), 0)
      const averageScore = completedLessons > 0 ? Math.round(totalScores / completedLessons) : 0

      setStats({
        completedLessons,
        totalXP: userData?.xp || 0,
        streak: userData?.streak_days || 0,
        averageScore,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {userData?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{userData?.name || "User"}</Text>

          <Text style={[styles.userEmail, { color: colors.text + "CC" }]}>{user?.email}</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <Icon name="book" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.completedLessons}</Text>
              <Text style={[styles.statLabel, { color: colors.text + "CC" }]}>Lessons</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="star" size={24} color={colors.secondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalXP}</Text>
              <Text style={[styles.statLabel, { color: colors.text + "CC" }]}>XP Points</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="flame" size={24} color={colors.error} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.streak}</Text>
              <Text style={[styles.statLabel, { color: colors.text + "CC" }]}>Day Streak</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="analytics" size={24} color={colors.info} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.averageScore}%</Text>
              <Text style={[styles.statLabel, { color: colors.text + "CC" }]}>Avg. Score</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("Achievements")}
          >
            <Icon name="trophy" size={24} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Achievements</Text>
            <Icon name="chevron-forward" size={20} color={colors.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]} onPress={toggleTheme}>
            <Icon name={isDark ? "sunny" : "moon"} size={24} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>{isDark ? "Light Mode" : "Dark Mode"}</Text>
            <Icon name="chevron-forward" size={20} color={colors.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Icon name="settings" size={24} color={colors.primary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
            <Icon name="chevron-forward" size={20} color={colors.text + "80"} />
          </TouchableOpacity>
        </View>

        <Button title="Sign Out" onPress={handleSignOut} variant="outline" style={styles.signOutButton} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    width: "50%",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  signOutButton: {
    marginBottom: 24,
  },
})
