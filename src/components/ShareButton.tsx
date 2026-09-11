"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"

interface ShareButtonProps {
  title: string
  url?: string
  text?: string
  iconOnly?: boolean
  block?: boolean
}

export default function ShareButton({ title, url, text, iconOnly, block }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareText = text || title

  const handleShare = async () => {
    // 1) NATIVE SHARE - telefonning o'z menyusi: ISTALGAN ilovaga yuborish
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl })
      } catch {
        // foydalanuvchi bekor qildi - jim qolamiz
      }
      return
    }
    // 2) Desktop fallback - linkni nusxalash
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Linkni nusxalang:", shareUrl)
    }
  }

  const cls = iconOnly
    ? "w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md hover:scale-110 transition-all flex-shrink-0"
    : block
    ? "w-full h-11 bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 font-semibold text-sm flex items-center justify-center gap-2"
    : "inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-zinc-800 backdrop-blur-xl border border-white/70 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"

  return (
    <button onClick={handleShare} className={cls} aria-label="Ulashish">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
      {!iconOnly && (copied ? "Nusxalandi!" : "Ulashish")}
    </button>
  )
}
