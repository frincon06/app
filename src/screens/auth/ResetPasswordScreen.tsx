"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Icon from "react-native-vector-icons/Ionicons"

export default function ResetPasswordScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { verifyOtp } = useAuth()

  const { email, token } = route.params || {}

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleResetPassword = async () => {
    // Reset error
    setError("")

    // Validate inputs
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const { error } = await verifyOtp(email, token, "recovery")

      if (error) {
        setError(error.message)
      } else {
        // Successfully reset password
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Create New Password</Text>
              <Text style={[styles.subtitle, { color: colors.text + "CC" }]}>
                Your new password must be different from previously used passwords
              </Text>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Input
                label="New Password"
                placeholder="Create a new password"
                leftIcon="lock-closed-outline"
                isPassword
                value={password}
                onChangeText={setPassword}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your new password"
                leftIcon="lock-closed-outline"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <Button title="Reset Password" onPress={handleResetPassword} loading={loading} style={styles.button} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
})
