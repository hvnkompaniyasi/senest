"use client";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Home, Camera, Maximize } from "lucide-react";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const touchX = useRef<number | null>(null);
  const lbTouchX = useRef<number | null>(null);

  const count = images.length;
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : count - 1));
  const next = () => setIndex((i) => (i < count - 1 ? i + 1 : 0));

  useEffect(() => { setZoom(1); }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightbox(false);
      else if (e.key === "+") setZoom((z) => Math.min(3, z + 0.5));
      else if (e.key === "-") setZoom((z) => Math.max(1, z - 0.5));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, count]);

  const swipe = (ref: React.MutableRefObject<number | null>, allow: boolean) => ({
    onTouchStart: (e: ReactTouchEvent) => { ref.current = e.touches[0].clientX; },
    onTouchEnd: (e: ReactTouchEvent) => {
      if (ref.current === null || !allow) { ref.current = null; return; }
      const dx = e.changedTouches[0].clientX - ref.current;
      ref.current = null;
      if (Math.abs(dx) > 50) { if (dx > 0) prev(); else next(); }
    },
  });

  if (!images.length) {
    return (
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
        <Home className="h-16 w-16 text-emerald-300 dark:text-emerald-800" />
      </div>
    );
  }

  return (
    <>
      {/* ===== ASOSIY GALEREYA ===== */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
        {...swipe(touchX, true)}
      >
        <Image
          src={images[index]}
          alt={`${title} - rasm ${index + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover select-none [touch-action:pan-y]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />

        {/* Yuqori o'ng: counter + zoom (kartochka ostida qolmaydi!) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {count > 1 && (
            <span className="glass-pill px-2.5 py-2 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
              <Camera className="h-3 w-3" /> {index + 1}/{count}
            </span>
          )}
          <button
            onClick={() => setLightbox(true)}
            className="glass-pill w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg"
            aria-label="To'liq ochish"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>

        {/* Nav arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass-pill w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-10"
              aria-label="Oldingi rasm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass-pill w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-10"
              aria-label="Keyingi rasm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Swipe hint */}
        {count > 1 && (
          <p className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/70 pointer-events-none">
            ← surib ko'ring →
          </p>
        )}
      </div>

      {/* ===== LIGHTBOX: swipe + zoom ===== */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20"
            onClick={() => setLightbox(false)}
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            {...swipe(lbTouchX, zoom === 1)}
          >
            <div
              className="relative w-[94vw] h-[75vh] max-w-5xl transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
              onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
            >
              <Image
                src={images[index]}
                alt={`${title} - rasm ${index + 1}`}
                fill
                sizes="94vw"
                className="object-contain select-none"
              />
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-40"
              disabled={zoom <= 1}
              aria-label="Uzoqlashtirish"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="glass-pill px-3 py-2 rounded-full text-xs font-bold text-white min-w-[52px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-40"
              disabled={zoom >= 3}
              aria-label="Yaqinlashtirish"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>

          {count > 1 && zoom === 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20"
                aria-label="Oldingi"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20"
                aria-label="Keyingi"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <p className="absolute top-4 left-4 glass-pill px-3 py-2 rounded-full text-xs font-bold text-white z-20">
            {index + 1} / {count}
          </p>
        </div>
      )}
    </>
  );
}
