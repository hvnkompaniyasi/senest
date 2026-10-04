"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Ruler, Crown } from "lucide-react";
import { formatPrice } from "@/lib/format";
import FavoriteToggle from "./FavoriteToggle";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  rooms: number;
  area: number;
  image: string;
  type: string;
  seller?: string;
  isPremium?: boolean;
  createdAt?: string;
}

export default function ListingCard({
  id, title, price, location, rooms, area, image, type, isPremium,
}: ListingCardProps) {
  return (
    <Link
      href={`/listing/${id}`}
      className="group relative block rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(10,124,78,0.10)] hover:shadow-[0_16px_44px_rgba(10,124,78,0.20)] transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-emerald-50 dark:bg-zinc-900">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

        {/* Badge'lar + fav */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5">
          <div className="flex flex-wrap gap-1.5">
            {isPremium && (
              <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[10px] font-extrabold text-amber-950 shadow-lg flex items-center gap-1">
                <Crown className="h-3 w-3" /> VIP
              </span>
            )}
            <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
              {type}
            </span>
          </div>
          <div
            className="z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <FavoriteToggle listingId={id} />
          </div>
        </div>

        {/* Narx + sarlavha + stats (rasm ustida) */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          <p className="text-white font-extrabold text-lg leading-tight drop-shadow-md">
            {formatPrice(price, type)}
          </p>
          <p className="text-white/95 text-xs font-semibold line-clamp-1 mt-0.5">
            {title || "Sarlavhasiz"}
          </p>
          <p className="text-white/65 text-[10px] font-medium flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </p>
          {(rooms > 0 || area > 0) && (
            <div className="glass-pill flex items-center gap-2.5 mt-2 px-2.5 py-1.5 rounded-xl w-fit">
              {rooms > 0 && (
                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                  <BedDouble className="h-3 w-3" /> {rooms} xona
                </span>
              )}
              {area > 0 && (
                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                  <Ruler className="h-3 w-3" /> {area} m²
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
