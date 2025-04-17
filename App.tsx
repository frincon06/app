import { StatusBar } from "react-native"
import { ThemeProvider } from "./src/contexts/ThemeContext"
import { AuthProvider } from "./src/contexts/AuthContext"
import RootNavigator from "./src/navigation/RootNavigator"

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  )
}
