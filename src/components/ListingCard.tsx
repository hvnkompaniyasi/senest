"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Heart, Loader2, MapPin, Home, Ruler, BadgeCheck, Crown, Sparkles } from "lucide-react"

interface ListingCardProps {
  id: string
  title: string
  price: number
  location: string
  rooms: number
  area: number
  image: string
  type: string
  seller?: string
  isPremium?: boolean
  createdAt?: string
}

// Sahifa uchun bitta umumiy favorites cache (N ta request o'rniga 1 ta)
let favCache: Set<string> | null = null
let favPromise: Promise<Set<string>> | null = null

function loadFavorites(): Promise<Set<string>> {
  if (favCache) return Promise.resolve(favCache)
  if (!favPromise) {
    favPromise = fetch("/api/favorites")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const arr: unknown = d?.favorites || d?.listings || (Array.isArray(d) ? d : [])
        const list = Array.isArray(arr) ? arr : []
        favCache = new Set(
          list.map((f) => {
            const item = f as { listingId?: string; id?: string }
            return item.listingId || item.id || ""
          })
        )
        return favCache
      })
      .catch(() => {
        favCache = new Set<string>()
        return favCache
      })
  }
  return favPromise
}

export function invalidateFavoritesCache() {
  favCache = null
  favPromise = null
}

const isNew = (createdAt?: string) =>
  !!createdAt && Date.now() - new Date(createdAt).getTime() < 3 * 24 * 60 * 60 * 1000

export default function ListingCard({
  id, title, price, location, rooms, area, image, type, seller, isPremium, createdAt,
}: ListingCardProps) {
  const { data: session } = useSession()
  const [fav, setFav] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!session) return
    loadFavorites().then((set) => setFav(set.has(id)))
  }, [session, id])

  const toggleFav = async () => {
    if (!session) return
    setBusy(true)
    const prev = fav
    setFav(!prev)
    try {
      const res = await fetch("/api/favorites", {
        method: prev ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      })
      if (!res.ok && res.status === 405 && prev) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: id }),
        })
      }
      if (favCache) {
        const next = new Set(favCache)
        if (prev) next.delete(id)
        else next.add(id)
        favCache = next
      }
    } catch {
      setFav(prev)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-0.5 transition-all">
      <Link href={`/listing/${id}`} className="block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-900">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="h-8 w-8 text-orange-300" />
            </div>
          )}

          {/* Chap yuqori: badge'lar */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {isPremium && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[9px] font-extrabold rounded-full flex items-center gap-1 shadow">
                <Crown className="h-2.5 w-2.5" /> VIP
              </span>
            )}
            {isNew(createdAt) && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-[9px] font-extrabold rounded-full flex items-center gap-1 shadow">
                <Sparkles className="h-2.5 w-2.5" /> Yangi
              </span>
            )}
            <span className="px-2 py-0.5 bg-black/45 backdrop-blur-sm text-white text-[9px] font-bold rounded-full">
              {type}
            </span>
          </div>

          {/* Sotuvchi - pastki chap */}
          {seller && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 bg-black/45 backdrop-blur-sm rounded-full text-[9px] font-semibold text-white max-w-[75%]">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FF9500] to-[#FF6A00] flex items-center justify-center text-[7px] font-extrabold flex-shrink-0">
                {seller.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">{seller}</span>
              <BadgeCheck className="h-2.5 w-2.5 text-sky-400 flex-shrink-0" />
            </span>
          )}
        </div>
      </Link>

      {/* Heart - o'ng yuqori */}
      <button
        onClick={toggleFav}
        aria-label="Sevimlilarga qo'shish"
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow flex items-center justify-center hover:scale-110 transition-transform"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
        ) : (
          <Heart className={`h-3.5 w-3.5 ${fav ? "text-red-500 fill-current" : "text-gray-400"}`} />
        )}
      </button>

      <Link href={`/listing/${id}`} className="block p-2.5">
        <div className="text-base font-extrabold text-[#FF9500]">
          ${price.toLocaleString("en-US")}
        </div>
        <div className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2 leading-snug mt-0.5 min-h-[2em]">
          {title || "Sarlavhasiz"}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mt-1 truncate">
          <MapPin className="h-2.5 w-2.5 flex-shrink-0" /> {location}
        </div>
        {(rooms > 0 || area > 0) && (
          <div className="flex items-center gap-2.5 text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {rooms > 0 && (
              <span className="flex items-center gap-1"><Home className="h-2.5 w-2.5" /> {rooms} xona</span>
            )}
            {area > 0 && (
              <span className="flex items-center gap-1"><Ruler className="h-2.5 w-2.5" /> {area} m²</span>
            )}
          </div>
        )}
      </Link>
    </div>
  )
}
