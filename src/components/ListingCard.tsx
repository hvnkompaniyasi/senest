"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { MapPin, Bed, Maximize, Heart } from "lucide-react"

interface ListingCardProps {
  id: string
  title: string
  price: number
  location: string
  rooms: number
  area: number
  image: string
  type: string
  createdAt?: string
}

export default function ListingCard({ id, title, price, location, rooms, area, image, type, createdAt }: ListingCardProps) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetch(`/api/favorites`)
        .then(r => r.json())
        .then(data => {
          const isFav = data.favorites?.some((f: any) => f.listingId === id)
          setIsFavorite(isFav)
        })
        .catch(() => {})
    }
  }, [session, id])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session) {
      window.location.href = `/login?callbackUrl=${window.location.pathname}`
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        await fetch(`/api/favorites?listingId=${id}`, { method: "DELETE" })
        setIsFavorite(false)
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId: id }),
        })
        setIsFavorite(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.a
      href={`/listing/${id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group block"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-400/20 transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100">
          {image ? (
            <img src={image} alt={title || "E'lon rasmi"} loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">🏠</span>
            </div>
          )}
          
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-orange-600 shadow">
              {type}
            </span>
          </div>
          
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow transition-all ${
              isFavorite 
                ? "bg-red-500 text-white scale-110" 
                : "bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-red-50 hover:text-red-500"
            }`}
            aria-label={isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="p-4">
          <div className="text-xl font-bold text-orange-600 mb-1">${price.toLocaleString("en-US")}</div>
          <h3 className="font-semibold text-gray-800 mb-2 truncate">{title || "Sarlavhasiz e'lon"}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          {(rooms > 0 || area > 0) && (
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
              {rooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-orange-500" />
                  {rooms} xona
                </span>
              )}
              {area > 0 && (
                <span className="flex items-center gap-1">
                  <Maximize className="h-4 w-4 text-orange-500" />
                  {area} m²
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.a>
  )
}
