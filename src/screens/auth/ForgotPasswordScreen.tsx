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
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Icon from "react-native-vector-icons/Ionicons"

export default function ForgotPasswordScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleResetPassword = async () => {
    // Reset states
    setError("")
    setSuccess(false)

    // Validate email
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const { error } = await forgotPassword(email)

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
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
              <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
              <Text style={[styles.subtitle, { color: colors.text + "CC" }]}>
                Enter your email address and we'll send you instructions to reset your password
              </Text>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {success ? (
              <View style={[styles.successContainer, { backgroundColor: colors.success + "20" }]}>
                <Text style={[styles.successText, { color: colors.success }]}>
                  Password reset instructions have been sent to your email
                </Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                value={email}
                onChangeText={setEmail}
              />

              <Button
                title="Send Reset Instructions"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.button}
              />

              <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backToLogin}>
                <Text style={[styles.backToLoginText, { color: colors.primary }]}>Back to Login</Text>
              </TouchableOpacity>
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
  successContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
  backToLogin: {
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: "600",
  },
})
