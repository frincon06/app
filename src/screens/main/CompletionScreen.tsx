"use client"
import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import Button from "../../components/ui/Button"
import Icon from "react-native-vector-icons/Ionicons"
import LottieView from "lottie-react-native"

export default function CompletionScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const { score, totalQuestions, correctAnswers, lessonId, courseId } = route.params

  const getScoreMessage = () => {
    if (score >= 90) return "Excellent!"
    if (score >= 70) return "Great job!"
    if (score >= 50) return "Good effort!"
    return "Keep practicing!"
  }

  const getScoreColor = () => {
    if (score >= 90) return colors.success
    if (score >= 70) return colors.primary
    if (score >= 50) return colors.secondary
    return colors.error
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../../assets/animations/completion.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Lesson Completed!</Text>

        <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>{getScoreMessage()}</Text>

        <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: colors.text }]}>{score}%</Text>
            <Text style={[styles.scoreLabel, { color: colors.text + "CC" }]}>Score</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: colors.text }]}>
              {correctAnswers}/{totalQuestions}
            </Text>
            <Text style={[styles.scoreLabel, { color: colors.text + "CC" }]}>Correct</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: colors.text }]}>+50</Text>
            <Text style={[styles.scoreLabel, { color: colors.text + "CC" }]}>XP Earned</Text>
          </View>
        </View>

        <View style={styles.rewardsContainer}>
          <View style={[styles.rewardItem, { backgroundColor: colors.primary + "20" }]}>
            <Icon name="flame" size={24} color={colors.primary} />
            <Text style={[styles.rewardText, { color: colors.text }]}>Daily Streak +1</Text>
          </View>

          <View style={[styles.rewardItem, { backgroundColor: colors.secondary + "20" }]}>
            <Icon name="trophy" size={24} color={colors.secondary} />
            <Text style={[styles.rewardText, { color: colors.text }]}>Achievement Unlocked</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Continue" onPress={() => navigation.navigate("HomeMain")} style={styles.button} />

          <Button
            title="Review Lesson"
            onPress={() => navigation.navigate("Lesson", { lessonId, courseId })}
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
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  scoreCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
  },
  scoreItem: {
    flex: 1,
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
  },
  divider: {
    width: 1,
    marginHorizontal: 8,
  },
  rewardsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    marginBottom: 12,
  },
})
