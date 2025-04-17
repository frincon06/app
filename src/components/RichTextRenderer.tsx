"use client"
import { StyleSheet } from "react-native"
import RenderHtml from "react-native-render-html"
import { useWindowDimensions } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

interface RichTextRendererProps {
  html: string
  contentWidth?: number
}

export default function RichTextRenderer({ html, contentWidth }: RichTextRendererProps) {
  const { width } = useWindowDimensions()
  const { colors, isDark } = useTheme()

  // Ancho del contenido, por defecto el ancho de la ventana menos un padding
  const containerWidth = contentWidth || width - 32

  // Estilos base para el HTML renderizado
  const tagsStyles = {
    body: {
      color: colors.text,
      fontFamily: "System",
      fontSize: 16,
      lineHeight: 24,
    },
    p: {
      marginBottom: 16,
    },
    h1: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 16,
    },
    h2: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 14,
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 12,
    },
    h4: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 10,
    },
    h5: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 8,
    },
    h6: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 6,
    },
    a: {
      color: colors.primary,
      textDecorationLine: "underline",
    },
    ul: {
      marginBottom: 16,
    },
    ol: {
      marginBottom: 16,
    },
    li: {
      marginBottom: 8,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      paddingLeft: 16,
      marginVertical: 16,
      fontStyle: "italic",
    },
    code: {
      fontFamily: "monospace",
      backgroundColor: isDark ? "#2d2d2d" : "#f5f5f5",
      padding: 4,
      borderRadius: 4,
    },
    pre: {
      backgroundColor: isDark ? "#2d2d2d" : "#f5f5f5",
      padding: 16,
      borderRadius: 8,
      marginVertical: 16,
      overflow: "scroll",
    },
    img: {
      marginVertical: 16,
      borderRadius: 8,
    },
  }

  return (
    <RenderHtml
      contentWidth={containerWidth}
      source={{ html }}
      tagsStyles={tagsStyles}
      enableExperimentalMarginCollapsing={true}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
