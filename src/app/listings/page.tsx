import { Suspense } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ListingsBrowser from "@/components/ListingsBrowser"
import ListingSkeleton from "@/components/ListingSkeleton"
import { MapPin } from "lucide-react"

export const dynamic = "force-dynamic"

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Barcha e'lonlar</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">O'zingizga mos uy-joyni toping</p>
          </div>
          <Link href="/map" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 dark:bg-zinc-900 border border-white/70 dark:border-zinc-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg transition-all">
            <MapPin className="h-4 w-4 text-orange-500" /> Xaritada
          </Link>
        </div>
        <Suspense fallback={<ListingSkeleton count={6} />}>
          <ListingsBrowser />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
