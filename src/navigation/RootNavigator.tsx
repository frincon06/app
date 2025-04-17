"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Linking } from "react-native"
import { useAuth } from "../contexts/AuthContext"
import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"
import LoadingScreen from "../screens/LoadingScreen"

const Stack = createStackNavigator()

export default function RootNavigator() {
  const { isLoading, user, isVerified } = useAuth()

  useEffect(() => {
    // Handle deep links
    const handleDeepLink = (event) => {
      const url = event.url

      // Handle verification links
      if (url.includes("verify-email") || url.includes("reset-password")) {
        // Extract token and email from URL
        const params = url.split("?")[1]
        if (params) {
          const urlParams = new URLSearchParams(params)
          const token = urlParams.get("token")
          const email = urlParams.get("email")

          if (token && email) {
            // Navigate to appropriate screen based on the URL
            if (url.includes("verify-email")) {
              navigation.navigate("VerifyEmail", { email, token })
            } else if (url.includes("reset-password")) {
              navigation.navigate("ResetPassword", { email, token })
            }
          }
        }
      }
    }

    // Add event listener for deep links
    Linking.addEventListener("url", handleDeepLink)

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
    })

    return () => {
      // Remove event listener
      Linking.removeEventListener("url", handleDeepLink)
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
