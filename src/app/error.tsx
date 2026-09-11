"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Nimadir noto'g'ri ketdi</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Xato haqida xabar berdik. Iltimos, qayta urinib ko'ring.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold rounded-xl flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Qayta urinish
          </button>
          <Link href="/" className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl flex items-center gap-2">
            <Home className="h-4 w-4" /> Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  )
}
