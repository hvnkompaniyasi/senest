"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ListingSkeleton from "@/components/ListingSkeleton"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ListingCard from "@/components/ListingCard"
import SearchFilters from "@/components/SearchFilters"
import { FilterState, DEFAULT_FILTERS, DEAL_TYPES } from "@/lib/locations"

interface DbListing {
  id: string
  price: number
  region: string
  district: string
  rooms: number | null
  area: number | null
  images: string[]
  type: string
  createdAt: string
  category: string
}

interface ListingsBrowserProps {
  dealFilter?: string
}

export default function ListingsBrowser({ dealFilter }: ListingsBrowserProps = {}) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [listings, setListings] = useState<DbListing[]>([])
  const [loading, setLoading] = useState(true)

  const urlCategory = searchParams.get("category") || ""
  const urlDeal = searchParams.get("deal") || ""

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    region: searchParams.get("region") || "",
    district: searchParams.get("district") || "",
    category: urlCategory || (urlDeal === "RENT" ? "RENT" : ""),
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rooms: searchParams.get("rooms") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  })

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.region) params.set("region", filters.region)
      if (filters.district) params.set("district", filters.district)

      // Ijara tanlangan bo'lsa -> deal, aks holda category
      if (filters.category === "RENT") {
        params.set("deal", "RENT")
      } else if (filters.category) {
        params.set("category", filters.category)
      }

      if (dealFilter) params.set("deal", dealFilter)
      if (urlDeal && !dealFilter) params.set("deal", urlDeal)
      if (filters.minPrice) params.set("minPrice", filters.minPrice)
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
      if (filters.rooms) params.set("rooms", filters.rooms)
      if (filters.minArea) params.set("minArea", filters.minArea)
      if (filters.maxArea) params.set("maxArea", filters.maxArea)
      if (filters.sortBy) params.set("sortBy", filters.sortBy)
      if (searchQuery) params.set("q", searchQuery)

      const res = await fetch(`/api/listings?${params.toString()}`)
      const data = await res.json()
      setListings(data.listings || [])
    } catch (err) {
      console.error("Fetch error:", err)
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [filters, dealFilter, urlDeal, searchQuery])

  useEffect(() => {
    const timer = setTimeout(fetchListings, 300)
    return () => clearTimeout(timer)
  }, [fetchListings])

  const dealLabel = (type: string) => DEAL_TYPES.find((d) => d.id === type)?.name || type

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        

        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <Input
              placeholder="Sarlavha yoki manzil bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-11 h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-lg sm:rounded-xl"
            />
          </div>

          <SearchFilters filters={filters} onChange={setFilters} onSearch={() => setShowFilters(false)} showAdvanced={showFilters} />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Kamroq filtrlar" : "Kengaytirilgan qidiruv"}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={[listing.region, listing.district].filter(Boolean).join(", ")}
                rooms={listing.rooms || 0}
                area={listing.area || 0}
                image={listing.images?.[0] || ""}
                type={dealLabel(listing.type)}
                createdAt={listing.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">E'lonlar topilmadi</h3>
            <p className="text-sm sm:text-base text-gray-500">Hozircha bu filter bo'yicha e'lonlar yo'q. Birinchi e'lonni siz qo'shing!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
