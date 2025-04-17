import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

interface DashboardStatsProps {
  title: string
  value: string
  icon: React.ReactNode
  description?: string
}

export default function DashboardStats({ title, value, icon, description }: DashboardStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-purple-100 p-1.5 text-purple-700">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  )
}
