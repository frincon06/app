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

export default function LoginScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { signIn, resendVerificationEmail } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setNeedsVerification(false)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        // Check if the error is due to email not being verified
        if (error.message.includes("Email not confirmed") || error.message.includes("not verified")) {
          setNeedsVerification(true)
        } else {
          setError(error.message)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error } = await resendVerificationEmail(email)

      if (error) {
        setError(error.message)
      } else {
        // Navigate to verification screen
        navigation.navigate("VerifyEmail", { email })
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
              <Text style={[styles.title, { color: colors.text }]}>Sign In</Text>
              <Text style={[styles.subtitle, { color: colors.text + "CC" }]}>
                Welcome back! Please sign in to continue
              </Text>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {needsVerification ? (
              <View style={[styles.warningContainer, { backgroundColor: colors.warning + "20" }]}>
                <Text style={[styles.warningText, { color: colors.warning }]}>
                  Your email is not verified. Please verify your email to continue.
                </Text>
                <TouchableOpacity onPress={handleResendVerification} style={styles.verifyButton}>
                  <Text style={[styles.verifyButtonText, { color: colors.warning }]}>Resend verification email</Text>
                </TouchableOpacity>
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

              <Input
                label="Password"
                placeholder="Enter your password"
                leftIcon="lock-closed-outline"
                isPassword
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.button} />

              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { color: colors.text }]}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text style={[styles.signupLink, { color: colors.primary }]}>{" Sign Up"}</Text>
                </TouchableOpacity>
              </View>
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
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 8,
  },
  verifyButton: {
    alignSelf: "flex-start",
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  form: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  button: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
})
