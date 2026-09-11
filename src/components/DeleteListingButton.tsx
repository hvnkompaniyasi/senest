"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"

export default function DeleteListingButton({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const remove = async () => {
    if (!window.confirm("E'lonni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.")) return
    setBusy(true)
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        const d = await res.json()
        alert(d.error || "Xatolik")
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="h-10 px-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      O'chirish
    </button>
  )
}
