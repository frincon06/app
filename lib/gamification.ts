// Niveles de usuario y XP requerida
const LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 2000 },
  { level: 7, xpRequired: 3500 },
  { level: 8, xpRequired: 5000 },
  { level: 9, xpRequired: 7500 },
  { level: 10, xpRequired: 10000 },
]

// Función para calcular el nivel del usuario basado en XP
export function calculateUserLevel(xp: number): { level: number; nextLevelXp: number; progress: number } {
  // Encontrar el nivel actual
  let currentLevel = LEVELS[0]
  let nextLevel = LEVELS[1]

  for (let i = 1; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] || LEVELS[i]
    } else {
      nextLevel = LEVELS[i]
      break
    }
  }

  // Calcular el progreso hacia el siguiente nivel
  const currentLevelXp = currentLevel.xpRequired
  const nextLevelXp = nextLevel.xpRequired
  const xpForNextLevel = nextLevelXp - currentLevelXp
  const xpProgress = xp - currentLevelXp
  const progress = xpForNextLevel > 0 ? (xpProgress / xpForNextLevel) * 100 : 100

  return {
    level: currentLevel.level,
    nextLevelXp: nextLevelXp,
    progress: Math.min(Math.max(progress, 0), 100),
  }
}

// Calcular XP para una lección completada
export function calculateLessonXp(correctAnswers: number, totalQuestions: number): number {
  // XP base por completar una lección
  const baseXp = 50

  // XP adicional por respuestas correctas (10 XP por respuesta correcta)
  const correctAnswersXp = correctAnswers * 10

  return baseXp + correctAnswersXp
}
