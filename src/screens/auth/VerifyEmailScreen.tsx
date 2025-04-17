"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Icon from "react-native-vector-icons/Ionicons"

export default function VerifyEmailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { resendVerificationEmail, verifyOtp } = useAuth()

  const { email } = route.params || {}

  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendSuccess, setResendSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error } = await verifyOtp(email, verificationCode, "signup")

      if (error) {
        setError(error.message)
      } else {
        // Successfully verified
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError("")
    setResendSuccess(false)

    try {
      const { error } = await resendVerificationEmail(email)

      if (error) {
        setError(error.message)
      } else {
        setResendSuccess(true)
        setCountdown(60) // 60 seconds cooldown
      }
    } catch (err) {
      setError("Failed to resend verification email")
      console.error(err)
    } finally {
      setResendLoading(false)
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
            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/email-verification.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Verify Your Email</Text>
              <Text style={[styles.subtitle, { color: colors.text + "CC" }]}>
                We've sent a verification code to {email}. Please check your inbox and enter the code below.
              </Text>
            </View>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {resendSuccess ? (
              <View style={[styles.successContainer, { backgroundColor: colors.success + "20" }]}>
                <Text style={[styles.successText, { color: colors.success }]}>
                  Verification code has been resent to your email
                </Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Input
                label="Verification Code"
                placeholder="Enter the 6-digit code"
                keyboardType="number-pad"
                leftIcon="key-outline"
                value={verificationCode}
                onChangeText={setVerificationCode}
                maxLength={6}
              />

              <Button title="Verify Email" onPress={handleVerify} loading={loading} style={styles.button} />

              <View style={styles.resendContainer}>
                <Text style={[styles.resendText, { color: colors.text }]}>Didn't receive the code?</Text>
                {countdown > 0 ? (
                  <Text style={[styles.countdownText, { color: colors.primary }]}>Resend in {countdown}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResendCode} disabled={resendLoading || countdown > 0}>
                    <Text style={[styles.resendLink, { color: colors.primary }]}>
                      {resendLoading ? "Sending..." : " Resend Code"}
                    </Text>
                  </TouchableOpacity>
                )}
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  image: {
    width: 200,
    height: 200,
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  countdownText: {
    fontSize: 14,
    marginLeft: 4,
  },
})
