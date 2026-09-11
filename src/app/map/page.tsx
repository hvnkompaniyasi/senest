"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MapPin, List, Loader2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"
import ListingCard from "@/components/ListingCard"
import { REGIONS, DEAL_TYPES } from "@/lib/locations"
import { listingCoords } from "@/lib/geo"

interface MapListing {
  id: string
  title: string
  price: number
  region: string
  district: string
  rooms: number | null
  area: number | null
  images: string[]
  type: string
  latitude: number | null
  longitude: number | null
}

const coordsOf = (l: MapListing): [number, number] =>
  l.latitude && l.longitude ? [l.latitude, l.longitude] : listingCoords(l.region, l.district, l.id)

export default function MapPage() {
  const divRef = useRef<HTMLDivElement>(null)
  const LRef = useRef<any>(null)
  const mapRef = useRef<any>(null)
  const groupRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [listings, setListings] = useState<MapListing[]>([])
  const [region, setRegion] = useState("")
  const [deal, setDeal] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let map: any
    let cancelled = false
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !divRef.current) return
      LRef.current = L
      map = L.map(divRef.current, { zoomControl: false }).setView([41.3111, 69.2797], 6)
      L.control.zoom({ position: "bottomright" }).addTo(map)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map)
      groupRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
      setReady(true)
    })()
    return () => { cancelled = true; if (map) map.remove() }
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (region) params.set("region", region)
    if (deal) params.set("deal", deal)
    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [region, deal])

  useEffect(() => {
    const L = LRef.current
    const group = groupRef.current
    const map = mapRef.current
    if (!ready || !L || !group || !map) return
    group.clearLayers()
    listings.forEach((l) => {
      const [lat, lng] = coordsOf(l)
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:linear-gradient(135deg,#fb923c,#f59e0b);color:#fff;padding:5px 12px;border-radius:9999px;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(249,115,22,.45);border:2px solid #fff;white-space:nowrap;transform:translate(-50%,-50%)">$${Math.round(l.price / 1000)}k</div>`,
        iconSize: [0, 0],
      })
      const marker = L.marker([lat, lng], { icon }).addTo(group)
      marker.bindPopup(
        `<div style="min-width:190px">
          ${l.images?.[0] ? `<img src="${l.images[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:10px;margin-bottom:8px"/>` : ""}
          <div style="font-weight:700;font-size:13px;margin-bottom:2px">${(l.title || "Sarlavhasiz").slice(0, 45)}</div>
          <div style="color:#ea580c;font-weight:800;font-size:15px">$${l.price.toLocaleString("en-US")}</div>
          <div style="color:#6b7280;font-size:11px;margin:5px 0 8px">${l.region}${l.district ? ", " + l.district : ""}</div>
          <a href="/listing/${l.id}" style="display:block;text-align:center;background:linear-gradient(135deg,#fb923c,#f59e0b);color:#fff;padding:8px;border-radius:10px;font-size:12px;font-weight:700;text-decoration:none">Ko'rish</a>
        </div>`
      )
    })
    if (listings.length > 0) {
      const pts = listings.map((l) => { const [la, ln] = coordsOf(l); return L.latLng(la, ln) })
      map.fitBounds(L.latLngBounds(pts), { padding: [50, 50] })
    }
  }, [listings, ready])

  const selectCls = "h-11 w-full px-3 bg-white/90 dark:bg-zinc-900 border border-white/70 dark:border-zinc-800 rounded-xl text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 pb-20 lg:pb-8">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <MapPin className="h-6 w-6 text-orange-500" /> Xaritada ko'rish
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {loading ? "Yuklanmoqda..." : `${listings.length} ta e'lon xaritada`}
            </p>
          </div>
          <Link href="/listings" className="h-10 px-4 bg-white/90 dark:bg-zinc-900 border border-white/70 dark:border-zinc-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 shadow-md">
            <List className="h-4 w-4" /> Ro'yxat
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectCls}>
            <option value="">Barcha hududlar</option>
            {REGIONS.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
          </select>
          <select value={deal} onChange={(e) => setDeal(e.target.value)} className={selectCls}>
            <option value="">Barcha turlar</option>
            {DEAL_TYPES.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/70 dark:border-zinc-800 h-[45vh] sm:h-[55vh]">
          <div ref={divRef} className="w-full h-full" />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-orange-50 dark:bg-zinc-900">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          )}
        </div>

        {listings.length > 0 && (
          <div className="mt-5">
            <h2 className="font-bold text-gray-800 dark:text-white mb-3 text-base sm:text-lg">
              Xaritadagi e'lonlar ({listings.length})
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {listings.map((l) => (
                <ListingCard
                  key={l.id}
                  id={l.id}
                  title={l.title}
                  price={l.price}
                  location={[l.region, l.district].filter(Boolean).join(", ")}
                  rooms={l.rooms || 0}
                  area={l.area || 0}
                  image={l.images?.[0] || ""}
                  type={DEAL_TYPES.find((d) => d.id === l.type)?.name || l.type}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
