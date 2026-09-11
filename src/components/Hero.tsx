import Link from "next/link"
import { Search, MapPin, Plus } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative py-10 sm:py-16 overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200/40 dark:bg-orange-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/40 dark:bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-white/70 dark:border-zinc-800 rounded-full shadow-md mb-5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
            O'zbekiston bo'ylab ishonchli e'lonlar
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            Uy-joyingizni
          </span>
          <br />
          <span className="text-gray-800 dark:text-white">osongina toping</span>
        </h1>

        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          Minglab e'lonlar orasidan o'zingizga mosini tanlang — ro'yxatda yoki xaritada
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/listings"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-400/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-base"
          >
            <Search className="h-5 w-5" /> Qidirish
          </Link>
          <Link
            href="/map"
            className="w-full sm:w-auto px-8 py-4 bg-white/90 dark:bg-zinc-900/90 border-2 border-white/70 dark:border-zinc-800 text-gray-800 dark:text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-base"
          >
            <MapPin className="h-5 w-5 text-orange-500" /> Xaritada ko'rish
          </Link>
        </div>

        <div className="mt-4">
          <Link href="/add-listing" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline">
            <Plus className="h-4 w-4" /> E'lon qo'shish — bepul
          </Link>
        </div>
      </div>
    </section>
  )
}
