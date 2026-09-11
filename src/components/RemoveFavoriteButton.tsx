"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"

export default function RemoveFavoriteButton({ listingId }: { listingId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const remove = async () => {
    setBusy(true)
    try {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      aria-label="Sevimlilardan o'chirish"
      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4 fill-current" />}
    </button>
  )
}
