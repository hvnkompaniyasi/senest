"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Loader2, X } from "lucide-react"

interface Props {
  initialName: string
  initialPhone: string
}

export default function ProfileEditSheet({ initialName, initialPhone }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const save = async () => {
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/me", {
        method: "function",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })
      const d = await res.json()
      if (!res.ok) {
        setError(d.error || "Xatolik")
        return
      }
      setOpen(false)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 hover:border-[#FF9500] transition-colors flex-shrink-0"
      >
        <Pencil className="h-3 w-3" /> Tahrirlash
      </button>

      {open && (
        <div className="fixed inset-0 z-[800] bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 inset-x-0 bg-white dark:bg-zinc-900 rounded-t-3xl p-5 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Profilni tahrirlash</h3>
              <button onClick={() => setOpen(false)} aria-label="Yopish">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Ism</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz"
                  className="h-12 w-full px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-[#FF9500]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Telefon</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998..."
                  className="h-12 w-full px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-[#FF9500]"
                />
              </div>
              <button
                onClick={save}
                disabled={busy}
                className="h-12 w-full bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-400/30 disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
