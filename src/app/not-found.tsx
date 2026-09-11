import Link from "next/link"
import { Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">404</div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Sahifa topilmadi</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Ehtimol, e'lon o'chirilgan yoki havola eskirgan</p>
        <div className="flex gap-3 justify-center">
          <Link href="/listings" className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold rounded-xl flex items-center gap-2">
            <Search className="h-4 w-4" /> E'lonlarni ko'rish
          </Link>
          <Link href="/" className="px-5 py-2.5 bg-white/90 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl flex items-center gap-2 border border-white/70 dark:border-zinc-700">
            <Home className="h-4 w-4" /> Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  )
}
