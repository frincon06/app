"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "../contexts/ThemeContext"
import Icon from "react-native-vector-icons/Ionicons"

// Screens
import HomeScreen from "../screens/main/HomeScreen"
import CoursesScreen from "../screens/main/CoursesScreen"
import CourseDetailScreen from "../screens/main/CourseDetailScreen"
import LessonScreen from "../screens/main/LessonScreen"
import QuestionScreen from "../screens/main/QuestionScreen"
import CompletionScreen from "../screens/main/CompletionScreen"
import ProfileScreen from "../screens/main/ProfileScreen"
import AchievementsScreen from "../screens/main/AchievementsScreen"
import SettingsScreen from "../screens/main/SettingsScreen"

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Courses" component={CoursesScreen} />
      <HomeStack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <HomeStack.Screen name="Lesson" component={LessonScreen} />
      <HomeStack.Screen name="Question" component={QuestionScreen} />
      <HomeStack.Screen name="Completion" component={CompletionScreen} />
    </HomeStack.Navigator>
  )
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Achievements" component={AchievementsScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  )
}

export default function MainNavigator() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  )
}
