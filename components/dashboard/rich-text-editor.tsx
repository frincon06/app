"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Importamos React Quill dinámicamente para evitar errores de SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px]" />,
})

// Importamos los estilos de React Quill
import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
  ],
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "color",
  "background",
  "blockquote",
  "code-block",
]

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")

  // Evitamos errores de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Skeleton className="w-full h-[300px]" />
  }

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="flex-1">
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Vista previa
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="p-0">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder || "Escribe el contenido aquí..."}
            className="min-h-[300px]"
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 prose max-w-none min-h-[300px]">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="text-gray-400">No hay contenido para previsualizar</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
