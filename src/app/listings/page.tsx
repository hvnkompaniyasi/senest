import { Suspense } from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import Navbar from "@/components/Navbar"
import ListingsBrowser from "@/components/ListingsBrowser"
import ListingSkeleton from "@/components/ListingSkeleton"
import Footer from "@/components/Footer"
import MobileNav from "@/components/MobileNav"

export const metadata = {
  title: "Barcha e'lonlar | Senest",
  description: "O'zbekiston bo'ylab barcha faol uy-joy e'lonlari — qidiring, filtrlang, xaritada ko'ring",
}

export const dynamic = "force-dynamic"

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pt-4 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              Barcha e'lonlar
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              O'zingizga mos uy-joyni toping
            </p>
          </div>
          <Link
            href="/map"
            className="h-10 px-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:border-[#FF9500] transition-colors flex-shrink-0"
          >
            <MapPin className="h-4 w-4 text-[#FF9500]" /> Xaritada
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <ListingSkeleton count={6} />
            </div>
          }
        >
          <ListingsBrowser />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
