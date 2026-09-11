"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, SlidersHorizontal, LocateFixed, Plus, Minus, X, Loader2, MapPin } from "lucide-react"
import { REGIONS, DEAL_TYPES } from "@/lib/locations"
import { listingCoords } from "@/lib/geo"
import MobileNav from "@/components/MobileNav"

interface MapListing {
  id: string
  title: string
  price: number
  region: string
  district: string
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
  const userMarkerRef = useRef<any>(null)

  const [ready, setReady] = useState(false)
  const [listings, setListings] = useState<MapListing[]>([])
  const [region, setRegion] = useState("")
  const [deal, setDeal] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  useEffect(() => {
    let map: any
    let cancelled = false
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !divRef.current) return
      LRef.current = L
      map = L.map(divRef.current, { zoomControl: false }).setView([41.3111, 69.2797], 6)
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
    const params = new URLSearchParams()
    if (region) params.set("region", region)
    if (deal) params.set("deal", deal)
    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .catch(() => setListings([]))
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
      map.fitBounds(L.latLngBounds(pts), { padding: [60, 60] })
    }
  }, [listings, ready])

  const locate = () => {
    if (!navigator.geolocation) { showToast("Brauzeringiz joylashuvni qo'llab-quvvatlamaydi"); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const map = mapRef.current
        const L = LRef.current
        if (!map || !L) return
        map.setView([latitude, longitude], 13)
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current)
        userMarkerRef.current = L.marker([latitude, longitude], {
          icon: L.divIcon({ className: "", html: '<div class="user-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        }).addTo(map)
        setLocating(false)
        showToast("📍 Joylashuvingiz belgilandi")
      },
      () => { setLocating(false); showToast("Joylashuv ruxsati berilmadi") },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const fabCls = "w-11 h-11 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-700 dark:text-gray-200 active:scale-95 transition-all"

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      <div ref={divRef} className="absolute inset-0 z-0" />

      {!ready && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-orange-50 dark:bg-zinc-900">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* Yuqori panel */}
      <div className="absolute top-3 left-3 right-3 z-[500] flex items-center gap-2">
        <Link href="/listings" className={fabCls} aria-label="Orqaga">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 h-11 px-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 flex items-center gap-2 min-w-0">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
            Xaritadagi e'lonlar: {listings.length}
          </span>
        </div>
        <button onClick={() => setSheetOpen(true)} className={fabCls} aria-label="Filtrlar">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[600] px-4 py-2 bg-zinc-900/90 text-white text-xs font-semibold rounded-full shadow-xl">
          {toast}
        </div>
      )}

      {/* O'ng past FAB'lar (karusel yo'q, pastda) */}
      <div className="absolute right-3 bottom-24 z-[500] flex flex-col gap-2">
        <button onClick={locate} className={fabCls} aria-label="O'zim turgan joy">
          {locating ? <Loader2 className="h-5 w-5 animate-spin text-blue-500" /> : <LocateFixed className="h-5 w-5 text-blue-500" />}
        </button>
        <button onClick={() => mapRef.current?.zoomIn()} className={fabCls} aria-label="Yaqinlashtirish">
          <Plus className="h-5 w-5" />
        </button>
        <button onClick={() => mapRef.current?.zoomOut()} className={fabCls} aria-label="Uzoqlashtirish">
          <Minus className="h-5 w-5" />
        </button>
      </div>

      {/* Filter bottom sheet */}
      {sheetOpen && (
        <div className="absolute inset-0 z-[700] bg-black/50 backdrop-blur-sm" onClick={() => setSheetOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl p-5 pb-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white">Filtrlar</h3>
              <button onClick={() => setSheetOpen(false)} aria-label="Yopish">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Hudud</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="h-12 w-full px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none">
                  <option value="">Barcha hududlar</option>
                  {REGIONS.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Bitim turi</label>
                <select value={deal} onChange={(e) => setDeal(e.target.value)} className="h-12 w-full px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none">
                  <option value="">Barcha turlar</option>
                  {DEAL_TYPES.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setRegion(""); setDeal("") }} className="flex-1 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold">
                  Tozalash
                </button>
                <button onClick={() => setSheetOpen(false)} className="flex-1 h-12 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl text-sm font-bold shadow-lg">
                  Ko'rish ({listings.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <MobileNav />
    </div>
  )
}
