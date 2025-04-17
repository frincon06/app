"use client"
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import Button from "../../components/ui/Button"

export default function WelcomeScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome to Sagrapp</Text>
          <Text style={[styles.subtitle, { color: colors.text + "CC" }]}>
            Your daily Bible study companion with a fun, gamified approach to spiritual growth
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Sign In" onPress={() => navigation.navigate("Login")} style={styles.button} />
          <Button
            title="Create Account"
            onPress={() => navigation.navigate("Signup")}
            variant="outline"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 48,
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    marginBottom: 48,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    marginBottom: 16,
  },
})
