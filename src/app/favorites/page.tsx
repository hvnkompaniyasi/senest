"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ListingCard from "@/components/ListingCard"
import { DEAL_TYPES } from "@/lib/locations"

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/favorites")
        .then(r => r.json())
        .then(data => setFavorites(data.favorites || []))
        .catch(() => setFavorites([]))
        .finally(() => setLoading(false))
    } else if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/favorites")
    }
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Sevimli e'lonlarim
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {favorites.length} ta e'lon saqlangan
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Heart className="h-10 w-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Hozircha sevimli e'lonlar yo'q</h3>
            <p className="text-gray-500 mb-6">E'lonlarni ko'rib chiqing va ❤️ tugmasini bosing</p>
            <a href="/listings" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-semibold rounded-xl shadow-lg">
              E'lonlarni ko'rish
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {favorites.map((fav) => {
              const listing = fav.listing
              return (
                <ListingCard
                  key={fav.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={[listing.region, listing.district].filter(Boolean).join(", ")}
                  rooms={listing.rooms || 0}
                  area={listing.area || 0}
                  image={listing.images?.[0] || ""}
                  type={DEAL_TYPES.find(d => d.id === listing.type)?.name || listing.type}
                />
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
