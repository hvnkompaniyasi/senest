import { Suspense } from "react"
import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Barcha e'lonlar - Senest" }

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
      <div className="flex justify-end mb-3">
            <Link href="/map" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 dark:bg-zinc-900 border border-white/70 dark:border-zinc-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg transition-all">
              🗺️ Xaritada ko'rish
            </Link>
          </div>
          <ListingsBrowser title="Barcha e'lonlar" subtitle="Platformadagi barcha faol e'lonlar" />
    </Suspense>
  )
}