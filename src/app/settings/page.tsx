"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, KeyRound, Loader2, CheckCircle, ShieldAlert } from "lucide-react"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"

const inputCls =
  "h-12 w-full px-4 bg-white/90 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-orange-400"

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/settings")
  }, [status, router])

  const submit = async () => {
    setError("")
    setSuccess(false)
    if (next !== confirm) {
      setError("Yangi parollar mos kelmadi")
      return
    }
    if (next.length < 6) {
      setError("Yangi parol kamida 6 belgi bo'lishi kerak")
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const d = await res.json()
      if (!res.ok) {
        setError(d.error || "Xatolik")
        return
      }
      setSuccess(true)
      setCurrent("")
      setNext("")
      setConfirm("")
    } finally {
      setBusy(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }
  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 pb-24 lg:pb-10">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 hover:text-orange-600">
          <ArrowLeft className="h-4 w-4" /> Profilga qaytish
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-orange-500" /> Sozlamalar
        </h1>

        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-5 shadow-lg">
          <h2 className="font-bold text-gray-800 dark:text-white mb-1">Parolni o'zgartirish</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" /> Parol kamida 6 belgi, harf va raqamlardan iborat bo'lsin
          </p>

          {error && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Parol muvaffaqiyatli o'zgartirildi
            </div>
          )}

          <div className="space-y-3">
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Hozirgi parol"
              className={inputCls}
            />
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Yangi parol"
              className={inputCls}
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Yangi parol (takroran)"
              className={inputCls}
            />
            <button
              onClick={submit}
              disabled={busy || !current || !next || !confirm}
              className="h-12 w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-400/30 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Parolni yangilash
            </button>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
