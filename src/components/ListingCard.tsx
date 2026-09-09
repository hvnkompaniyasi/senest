import Link from "next/link"
import { MapPin, Bed, Maximize, Heart } from "lucide-react"

interface ListingCardProps {
  id: string
  title: string
  price: number
  location: string
  rooms: number
  area: number
  image: string
  type: string
}

export default function ListingCard({ id, title, price, location, rooms, area, image, type }: ListingCardProps) {
  return (
    <Link href={`/listing/${id}`} className="group">
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-400/20 transition-all duration-300 hover:-translate-y-1">
        
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 flex items-center justify-center">
            <span className="text-6xl">🏠</span>
          </div>
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-orange-600">
            {type}
          </div>
          
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            ${price.toLocaleString()}
          </div>
          
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Bed className="h-4 w-4 text-orange-500" />
              <span>{rooms} xona</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Maximize className="h-4 w-4 text-orange-500" />
              <span>{area} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}