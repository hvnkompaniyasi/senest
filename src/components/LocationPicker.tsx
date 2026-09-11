"use client"

import { useEffect, useRef, useState } from "react"
import { LocateFixed, Loader2 } from "lucide-react"
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
  const [ready, setReady] = useState(false)
  const [locating, setLocating] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const initializedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !divRef.current) return
      map = L.map(divRef.current, { zoomControl: false }).setView([41.3111, 69.2797], 14)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map)

      // Xarita siljisa - markaz nuqtasi yangi manzil bo'ladi
      map.on("move", () => {
        const c = map.getCenter()
        onChangeRef.current(c.lat, c.lng)
      })

      mapRef.current = map
      setReady(true)
    })()
    return () => {
      cancelled = true
      if (map) map.remove()
    }
  }, [])

  // Boshlang'ich koordinata bor bo'lsa - o'sha yerga o'tish
  useEffect(() => {
    if (!ready || initializedRef.current) return
    initializedRef.current = true
    if (lat !== null && lng !== null) {
      mapRef.current?.setView([lat, lng], 16)
    }
  }, [ready, lat, lng])

  const locate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        // setView -> move event -> onChange avtomatik
        mapRef.current?.setView([latitude, longitude], 16)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="relative">
      <div
        ref={divRef}
        className="h-52 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 z-0"
      />

      {/* MARKAZIY PIN - xarita siljisa ham o'rtada qoladi */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-[400]">
        <svg width="40" height="40" viewBox="0 0 24 24" className="drop-shadow-xl" aria-hidden="true">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#FF9500"
            stroke="#fff"
            strokeWidth="1.2"
          />
          <circle cx="12" cy="9" r="2.8" fill="#fff" />
        </svg>
      </div>

      {/* Locate tugmasi */}
      <button
        type="button"
        onClick={locate}
        className="absolute top-2.5 right-2.5 z-[400] w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-blue-500 active:scale-95 transition-transform"
        aria-label="Joylashuvimni topish"
      >
        {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
      </button>

      <div className="flex items-start gap-1.5 mt-2 text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
        <svg width="12" height="12" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0" fill="#FF9500" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
        <span>
          {lat !== null && lng !== null
            ? `Manzil: ${lat.toFixed(5)}, ${lng.toFixed(5)} — xaritani surib aniqlashtiring`
            : "Xaritani suring — 📍 belgi markazda turadi, siljigan joy manzil bo'ladi"}
        </span>
      </div>
    </div>
  )
}
