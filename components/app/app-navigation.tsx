"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Award, User } from "lucide-react"

export function AppNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          <NavItem
            href="/app"
            icon={<Home className="w-6 h-6" />}
            label="Inicio"
            isActive={isActive("/app") && pathname === "/app"}
          />
          <NavItem
            href="/app/courses"
            icon={<BookOpen className="w-6 h-6" />}
            label="Cursos"
            isActive={isActive("/app/courses")}
          />
          <NavItem
            href="/app/achievements"
            icon={<Award className="w-6 h-6" />}
            label="Logros"
            isActive={isActive("/app/achievements")}
          />
          <NavItem
            href="/app/profile"
            icon={<User className="w-6 h-6" />}
            label="Perfil"
            isActive={isActive("/app/profile")}
          />
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <div
        className={`p-2 rounded-full ${isActive ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}
      >
        {icon}
      </div>
      <span
        className={`text-xs mt-1 ${isActive ? "text-purple-700 dark:text-purple-300 font-medium" : "text-gray-500 dark:text-gray-400"}`}
      >
        {label}
      </span>
    </Link>
  )
}
