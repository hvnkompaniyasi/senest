"use client";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, Home, Camera } from "lucide-react";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);

  const count = images.length;
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : count - 1));
  const next = () => setIndex((i) => (i < count - 1 ? i + 1 : 0));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, count]);

  if (!images.length) {
    return (
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
        <Home className="h-16 w-16 text-emerald-300 dark:text-emerald-800" />
      </div>
    );
  }

  return (
    <>
      {/* Main gallery — aspect-[4/3] bilan rasm ko'rinadi! */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={images[index]}
          alt={`${title} - rasm ${index + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover cursor-zoom-in select-none [touch-action:pan-y]"
          onClick={() => setLightbox(true)}
          onTouchStart={(e: ReactTouchEvent) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e: ReactTouchEvent) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />

        {/* Counter pill */}
        {count > 1 && (
          <div className="absolute bottom-3 right-3 glass-pill px-2.5 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
            <Camera className="h-3 w-3" />
            {index + 1} / {count}
          </div>
        )}

        {/* Zoom hint */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 glass-pill w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg"
          aria-label="Kattalashtirish"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Nav arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass-pill w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
              aria-label="Oldingi"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass-pill w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
              aria-label="Keyingi"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Thumbnail dots */}
        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Rasm ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
            onClick={() => setLightbox(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute top-4 left-4 glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-white">
            {index + 1} / {count}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative w-[92vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`${title} - rasm ${index + 1}`}
              fill
              className="object-contain"
              sizes="92vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
