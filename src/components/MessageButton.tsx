"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { MessageSquare, Loader2 } from "lucide-react"

export default function MessageButton({ listingId }: { listingId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const start = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/listing/${listingId}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      })
      const d = await res.json()
      if (!res.ok) {
        alert(d.error || "Xatolik")
        return
      }
      router.push(`/messages?c=${d.conversation.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={start}
      disabled={loading}
      className="h-12 w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-blue-500/25"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
      Xabar yuborish
    </button>
  )
}
