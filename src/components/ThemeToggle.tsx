"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("senest-theme")
    const isDark = saved === "dark"
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem("senest-theme", next ? "dark" : "light")
    document.documentElement.classList.toggle("dark", next)
  }

  if (!mounted) return <div className="w-9 h-9" aria-hidden="true" />

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-amber-300 shadow-md hover:scale-110 transition-all"
      aria-label={dark ? "Kunduzgi rejim" : "Tungi rejim"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
