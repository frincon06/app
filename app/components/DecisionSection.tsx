"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"

interface DecisionSectionProps {
  prompt: string
  onSubmit: (response: string) => void
  onNext: () => void
}

export default function DecisionSection({ prompt, onSubmit, onNext }: DecisionSectionProps) {
  const [response, setResponse] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit(response)
      setSubmitted(true)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Decisión</Text>
      <Text style={styles.prompt}>{prompt}</Text>

      {!submitted ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu respuesta aquí..."
            multiline
            value={response}
            onChangeText={setResponse}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={onNext}>
              <Text style={styles.skipButtonText}>Omitir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, !response.trim() && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!response.trim()}
            >
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.thanksContainer}>
          <Text style={styles.thanksText}>¡Gracias por compartir tu decisión!</Text>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  prompt: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#6200ee",
  },
  skipButtonText: {
    color: "#6200ee",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
  },
  thanksContainer: {
    alignItems: "center",
    padding: 16,
  },
  thanksText: {
    fontSize: 18,
    color: "#4caf50",
    marginBottom: 24,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
