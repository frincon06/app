import type React from "react"

interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  )
}
