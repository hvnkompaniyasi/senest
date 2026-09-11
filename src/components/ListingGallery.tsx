"use client"

import { useEffect, useRef, useState } from "react"
import type { TouchEvent as ReactTouchEvent } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, Home } from "lucide-react"

interface ListingGalleryProps {
  images: string[]
  title: string
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchX = useRef<number | null>(null)

  const count = images.length

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : count - 1))
  const next = () => setIndex((i) => (i < count - 1 ? i + 1 : 0))

  const onTouchStart = (e: ReactTouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx > 50) prev()
    else if (dx < -50) next()
    touchX.current = null
  }

  // Lightbox ochiq bo'lganda klaviatura
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  if (count === 0) {
    return (
      <div className="w-full h-64 sm:h-[420px] rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
        <Home className="h-14 w-14 text-orange-300 dark:text-zinc-600" />
      </div>
    )
  }

  return (
    <>
      {/* Asosiy galereya */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/70 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
        <img
          src={images[index]}
          alt={`${title} - rasm ${index + 1}`}
          onClick={() => setLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="w-full h-64 sm:h-[420px] object-cover cursor-zoom-in select-none [touch-action:pan-y]"
        />

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Oldingi rasm"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 transition-transform"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Keyingi rasm"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 transition-transform"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur text-white text-xs font-bold rounded-full">
          {index + 1} / {count}
        </span>

        <span className="absolute bottom-3 left-3 px-2.5 py-1.5 bg-black/60 backdrop-blur text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
          <ZoomIn className="h-3.5 w-3.5" /> To'liq ko'rish
        </span>

        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Rasm ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX - to'liq ekran */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[900] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            aria-label="Yopish"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center z-10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Oldingi rasm"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center z-10 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Keyingi rasm"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center z-10 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={images[index]}
            alt={`${title} - rasm ${index + 1}`}
            onClick={() => setLightbox(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="max-h-[88vh] max-w-[94vw] object-contain select-none [touch-action:pan-y]"
          />

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 text-white/90 text-sm font-semibold rounded-full">
            {index + 1} / {count}
          </span>
        </div>
      )}
    </>
  )
}
