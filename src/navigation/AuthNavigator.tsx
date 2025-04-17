import { createStackNavigator } from "@react-navigation/stack"
import WelcomeScreen from "../screens/auth/WelcomeScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import SignupScreen from "../screens/auth/SignupScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen"
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen"

const Stack = createStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  )
}
