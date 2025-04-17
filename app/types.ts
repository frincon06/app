export interface User {
  id: string
  email: string
  name?: string
  xp: number
  streak_days: number
  last_activity: string
}

export interface Course {
  id: string
  title: string
  description: string
  image_url: string
  order: number
  is_locked: boolean
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  devotional_text: string
  order: number
  is_locked: boolean
}

export interface Question {
  id: string
  lesson_id: string
  question_text: string
  question_type: "multiple_choice" | "true_false" | "fill_blank"
  options: string[]
  correct_answer: string
  order: number
}

export interface Decision {
  id: string
  lesson_id: string
  prompt: string
  is_enabled: boolean
}

export interface Activity {
  id: string
  lesson_id: string
  activity_type: "memorize_verse" | "prayer" | "share"
  content: string
  is_required: boolean
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number
  completed_at: string
}

export interface UserDecision {
  id: string
  user_id: string
  decision_id: string
  response: string
  created_at: string
}
