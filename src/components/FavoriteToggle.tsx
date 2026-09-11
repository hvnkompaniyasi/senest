"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Heart, Loader2 } from "lucide-react"

interface Props {
  listingId: string
  initial: boolean
}

export default function FavoriteToggle({ listingId, initial }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [fav, setFav] = useState(initial)
  const [busy, setBusy] = useState(false)

  const toggle = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/listing/${listingId}`)
      return
    }
    const prev = fav
    setFav(!prev)
    setBusy(true)
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      })
      if (!res.ok) setFav(prev)
    } catch {
      setFav(prev)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Sevimlilarga qo'shish"
      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
        fav ? "bg-white text-red-500 shadow-lg" : "bg-black/30 text-white hover:bg-black/45"
      }`}
    >
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
      )}
    </button>
  )
}
