"use client"

import { useState } from "react"
import { Home, ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const hasImages = images && images.length > 0

  if (!hasImages) {
    return (
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center">
        <Home className="h-20 w-20 text-orange-300" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
        <img src={images[index]} alt={title} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex((index - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => setIndex((index + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === index ? "border-orange-500 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
