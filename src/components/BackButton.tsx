"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      aria-label="Orqaga qaytish"
      className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/45 transition-colors"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  )
}
