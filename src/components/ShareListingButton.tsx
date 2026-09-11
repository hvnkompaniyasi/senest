"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"

export default function ShareListingButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const link = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url: link })
        return
      } catch {
        // bekor qilindi
      }
    }
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // jim
    }
  }

  return (
    <button
      onClick={share}
      className="h-12 flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm hover:border-orange-400 transition-colors"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Nusxalandi" : "Ulashish"}
    </button>
  )
}
