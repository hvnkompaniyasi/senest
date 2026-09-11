"use client"

import { useEffect, useRef } from "react"

interface MapPickerProps {
  value: { lat: number; lng: number } | null
  onChange: (coords: { lat: number; lng: number } | null) => void
  center?: [number, number]
}

export default function MapPicker({ value, onChange, center }: MapPickerProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const LRef = useRef<any>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    let map: any
    let cancelled = false
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !divRef.current) return
      LRef.current = L
      map = L.map(divRef.current, { zoomControl: true }).setView(center || [41.3111, 69.2797], 6)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map)
      map.on("click", (e: any) => {
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
      })
      mapRef.current = map
    })()
    return () => {
      cancelled = true
      if (map) map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Markerni yangilash
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return
    const pinIcon = L.divIcon({
      className: "",
      html: '<div style="width:26px;height:26px;background:linear-gradient(135deg,#fb923c,#f59e0b);border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.35)"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
    })
    if (value) {
      if (markerRef.current) {
        markerRef.current.setLatLng([value.lat, value.lng])
      } else {
        markerRef.current = L.marker([value.lat, value.lng], { icon: pinIcon }).addTo(map)
      }
      map.setView([value.lat, value.lng], Math.max(map.getZoom(), 14))
    } else if (markerRef.current) {
      map.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }, [value])

  // Region tanlanganda xaritani siljitish
  useEffect(() => {
    const map = mapRef.current
    if (map && center && !value) map.setView(center, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center])

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-white/70 dark:border-zinc-800 shadow-lg h-64 sm:h-80">
      <div ref={divRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 z-[500] pointer-events-none">
        <div className="inline-block px-3 py-1.5 bg-white/95 dark:bg-zinc-900/95 rounded-full text-[11px] font-semibold text-gray-700 dark:text-gray-200 shadow-md">
          📍 Xaritaga bosib aniq joylashuvni belgilang
        </div>
      </div>
    </div>
  )
}
