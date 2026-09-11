"use client"

import { useEffect, useRef, useState } from "react"
import { LocateFixed, Loader2, MapPin } from "lucide-react"
import "leaflet/dist/leaflet.css"

interface LocationPickerProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const divRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [locating, setLocating] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any
    let cancelled = false
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !divRef.current) return
      LRef.current = L
      map = L.map(divRef.current, { zoomControl: false }).setView([41.3111, 69.2797], 13)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map)
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        onChangeRef.current(e.latlng.lat, e.latlng.lng)
      })
      mapRef.current = map
      setReady(true)
    })()
    return () => {
      cancelled = true
      if (map) map.remove()
    }
  }, [])

  // Marker sync
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!ready || !L || !map) return

    if (lat !== null && lng !== null) {
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map)
        markerRef.current.on("dragend", () => {
          const p = markerRef.current.getLatLng()
          onChangeRef.current(p.lat, p.lng)
        })
        map.setView([lat, lng], 15)
      } else {
        const cur = markerRef.current.getLatLng()
        if (Math.abs(cur.lat - lat) > 0.000001 || Math.abs(cur.lng - lng) > 0.000001) {
          markerRef.current.setLatLng([lat, lng])
        }
      }
    } else if (markerRef.current) {
      map.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }, [lat, lng, ready])

  const locate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        onChangeRef.current(latitude, longitude)
        mapRef.current?.setView([latitude, longitude], 16)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="relative">
      <div ref={divRef} className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 z-0" />
      <button
        type="button"
        onClick={locate}
        className="absolute top-2.5 right-2.5 z-[400] w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-blue-500 active:scale-95 transition-transform"
        aria-label="Joylashuvimni topish"
      >
        {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
      </button>
      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 dark:text-gray-500">
        <MapPin className="h-3 w-3" />
        {lat !== null && lng !== null
          ? `Belgilandi: ${lat.toFixed(5)}, ${lng.toFixed(5)} (belgini surish mumkin)`
          : "Xaritaga bosing yoki 📍 tugmasi bilan joylashuvni belgilang"}
      </div>
    </div>
  )
}
