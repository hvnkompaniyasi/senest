"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X, Loader2, MapPin } from "lucide-react"
import ListingCard from "@/components/ListingCard"
import ListingSkeleton from "@/components/ListingSkeleton"
import { REGIONS, DEAL_TYPES } from "@/lib/locations"

interface Region {
  id: string
  name: string
  districts?: string[]
}

interface DbListing {
  id: string
  title: string
  price: number
  region: string
  district: string
  rooms: number | null
  area: number | null
  images: string[]
  type: string
}

interface ListingsBrowserProps {
  dealFilter?: string
}

const PAGE_SIZE = 12

const inputCls =
  "h-11 w-full px-3 bg-white/90 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400"

export default function ListingsBrowser({ dealFilter }: ListingsBrowserProps = {}) {
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get("q") || "")
  const [region, setRegion] = useState(searchParams.get("region") || "")
  const [district, setDistrict] = useState(searchParams.get("district") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [deal, setDeal] = useState(dealFilter || searchParams.get("deal") || "")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sort, setSort] = useState("new")
  const [showFilters, setShowFilters] = useState(false)

  const [listings, setListings] = useState<DbListing[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [skip, setSkip] = useState(0)

  const regions = REGIONS as Region[]
  const districts = regions.find((r) => r.name === region)?.districts || []

  // Qidiruv uchun debounce
  const [debouncedQ, setDebouncedQ] = useState(q)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400)
    return () => clearTimeout(t)
  }, [q])

  // Asosiy yuklash (filtrlar o'zgarganda)
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSkip(0)

    const params = new URLSearchParams()
    if (debouncedQ) params.set("q", debouncedQ)
    if (region) params.set("region", region)
    if (district) params.set("district", district)
    if (category) params.set("category", category)
    if (deal) params.set("deal", deal)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    params.set("sort", sort)
    params.set("take", String(PAGE_SIZE))
    params.set("skip", "0")

    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        setListings(d.listings || [])
        setTotal(d.total || 0)
        setHasMore(!!d.hasMore)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQ, region, district, category, deal, minPrice, maxPrice, sort])

  const loadMore = async () => {
    setLoadingMore(true)
    const nextSkip = skip + PAGE_SIZE
    const params = new URLSearchParams()
    if (debouncedQ) params.set("q", debouncedQ)
    if (region) params.set("region", region)
    if (district) params.set("district", district)
    if (category) params.set("category", category)
    if (deal) params.set("deal", deal)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    params.set("sort", sort)
    params.set("take", String(PAGE_SIZE))
    params.set("skip", String(nextSkip))

    try {
      const d = await (await fetch(`/api/listings?${params.toString()}`)).json()
      setListings((prev) => [...prev, ...(d.listings || [])])
      setSkip(nextSkip)
      setHasMore(!!d.hasMore)
    } catch {
      // jim
    } finally {
      setLoadingMore(false)
    }
  }

  const resetFilters = () => {
    setQ("")
    setRegion("")
    setDistrict("")
    setCategory("")
    setDeal("")
    setMinPrice("")
    setMaxPrice("")
    setSort("new")
  }

  const activeFilterCount = [region, district, category, deal, minPrice, maxPrice].filter(Boolean).length

  return (
    <div>
      {/* Qidiruv + filtr tugmasi */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sarlavha, manzil yoki hudud bo'yicha qidirish..."
            className={`${inputCls} pl-10`}
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-semibold border transition-colors ${
            showFilters || activeFilterCount > 0
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white/90 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrlar
          {activeFilterCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 bg-white text-orange-600 text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filtr paneli */}
      {showFilters && (
        <div className="mb-4 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl shadow-lg grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={region} onChange={(e) => { setRegion(e.target.value); setDistrict("") }} className={inputCls}>
            <option value="">Barcha hududlar</option>
            {regions.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls} disabled={!region}>
            <option value="">{region ? "Barcha tumanlar" : "Avval hudud tanlang"}</option>
            {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">Barcha turlar (mulkiy)</option>
            <option value="APARTMENT">Kvartira</option>
            <option value="HOUSE">Uy / Hovli</option>
            <option value="OFFICE">Ofis</option>
            <option value="LAND">Yer uchastkasi</option>
            <option value="WAREHOUSE">Ombor</option>
          </select>
          <select value={deal} onChange={(e) => setDeal(e.target.value)} className={inputCls}>
            <option value="">Barcha bitimlar</option>
            {DEAL_TYPES.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Narx: dan ($)" className={inputCls} />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Narx: gacha ($)" className={inputCls} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
            <option value="new">Eng yangilari</option>
            <option value="price_asc">Arzon → Qimmat</option>
            <option value="price_desc">Qimmat → Arzon</option>
          </select>
          <button onClick={resetFilters} className="h-11 px-4 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
            <X className="h-4 w-4" /> Tozalash
          </button>
        </div>
      )}

      {/* Natija soni */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading ? "Qidirilmoqda..." : `${total} ta e'lon topildi`}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <ListingSkeleton count={6} />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-white/70 dark:border-zinc-800">
          <MapPin className="h-12 w-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Hech narsa topilmadi</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Filtrlarni o'zgartirib yoki tozalab qayta urinib ko'ring
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-sm font-bold rounded-xl"
          >
            <X className="h-4 w-4" /> Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                id={l.id}
                title={l.title}
                price={l.price}
                location={[l.region, l.district].filter(Boolean).join(", ")}
                rooms={l.rooms || 0}
                area={l.area || 0}
                image={l.images?.[0] || ""}
                type={DEAL_TYPES.find((d) => d.id === l.type)?.name || l.type}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="h-12 px-8 bg-white/90 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm flex items-center gap-2 mx-auto hover:border-orange-400 transition-colors"
              >
                {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Yana yuklash ({total - listings.length} ta qoldi)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
