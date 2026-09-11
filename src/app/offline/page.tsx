"use client"

import Link from "next/link"
import { WifiOff, Home, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
          <WifiOff className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Internet aloqasi yo'q
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Iltimos, ulanishni tekshiring va qayta urinib ko'ring
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Qayta urinish
          </button>
          <Link href="/" className="px-5 py-2.5 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl flex items-center gap-2 border border-white/70 dark:border-zinc-700">
            <Home className="h-4 w-4" /> Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  )
}
