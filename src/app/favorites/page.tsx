import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Heart, Home, MapPin } from "lucide-react"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"
import RemoveFavoriteButton from "@/components/RemoveFavoriteButton"
import { DEAL_TYPES } from "@/lib/locations"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Sevimlilar | Senest",
  description: "Saqlangan e'lonlaringiz ro'yxati",
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login?callbackUrl=/favorites")

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
    orderBy: { createdAt: "desc" },
  })

  const active = favorites.filter((f) => f.listing.status === "ACTIVE")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 pb-24 lg:pb-10">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Heart className="h-6 w-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sevimlilar</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          {active.length} ta saqlangan e'lon
        </p>

        {active.length === 0 ? (
          <div className="text-center py-20 bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-white/70 dark:border-zinc-800">
            <Heart className="h-12 w-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Hali sevimli e'lonlaringiz yo'q
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-sm font-bold rounded-xl"
            >
              <Home className="h-4 w-4" /> E'lonlarni ko'rish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {active.map((f) => (
              <div key={f.id} className="relative">
                <Link
                  href={`/listing/${f.listing.id}`}
                  className="block bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative h-32 sm:h-40 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-900">
                    {f.listing.images?.[0] && (
                      <img src={f.listing.images[0]} alt="" className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/95 rounded-full text-[11px] font-bold text-orange-600 shadow">
                      {DEAL_TYPES.find((d) => d.id === f.listing.type)?.name || f.listing.type}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-base font-bold text-orange-600">
                      ${f.listing.price.toLocaleString("en-US")}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white truncate mt-0.5">
                      {f.listing.title || "Sarlavhasiz"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {f.listing.region}
                      {f.listing.district ? `, ${f.listing.district}` : ""}
                    </div>
                  </div>
                </Link>
                <RemoveFavoriteButton listingId={f.listing.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
