"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"
import { Search, SlidersHorizontal, X, Loader2, MapPin, LayoutGrid, List } from "lucide-react"
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
  createdAt: string
  isPremium: boolean
  user: { name: string | null; phone: string } | null
}

interface ListingsBrowserProps {
  dealFilter?: string
}

const PAGE_SIZE = 12

const CATEGORY_NAMES: Record<string, string> = {
  APARTMENT: "Kvartira",
  HOUSE: "Uy / Hovli",
  OFFICE: "Ofis",
  LAND: "Yer",
  WAREHOUSE: "Ombor",
}

const inputCls =
  "h-11 w-full px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-[#FF9500]"

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
  const [sheetOpen, setSheetOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [listings, setListings] = useState<DbListing[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [skip, setSkip] = useState(0)

  const regions = REGIONS as Region[]
  const districts = regions.find((r) => r.name === region)?.districts || []

  const [debouncedQ, setDebouncedQ] = useState(q)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400)
    return () => clearTimeout(t)
  }, [q])

  const buildParams = (nextSkip: number) => {
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
    return params
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSkip(0)
    fetch(`/api/listings?${buildParams(0).toString()}`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, region, district, category, deal, minPrice, maxPrice, sort])

  const loadMore = async () => {
    setLoadingMore(true)
    const nextSkip = skip + PAGE_SIZE
    try {
      const d = await (await fetch(`/api/listings?${buildParams(nextSkip).toString()}`)).json()
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
    setRegion("")
    setDistrict("")
    setCategory("")
    setDeal("")
    setMinPrice("")
    setMaxPrice("")
    setSort("new")
  }

  // Faol filtr chips
  const chips: { label: string; clear: () => void }[] = []
  if (region) chips.push({ label: region, clear: () => { setRegion(""); setDistrict("") } })
  if (district) chips.push({ label: district, clear: () => setDistrict("") })
  if (category) chips.push({ label: CATEGORY_NAMES[category] || category, clear: () => setCategory("") })
  if (deal) chips.push({ label: DEAL_TYPES.find((d) => d.id === deal)?.name || deal, clear: () => setDeal("") })
  if (minPrice) chips.push({ label: `dan $${minPrice}`, clear: () => setMinPrice("") })
  if (maxPrice) chips.push({ label: `gacha $${maxPrice}`, clear: () => setMaxPrice("") })

  return (
    <div className="pb-6">
      {/* Qidiruv + Filtr tugmasi */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sarlavha, manzil yoki hudud..."
            className="h-12 w-full pl-10 pr-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-[#FF9500] shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          />
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          aria-label="Filtrlar"
          className="relative w-12 h-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-[#FF9500] transition-colors flex-shrink-0"
        >
          <SlidersHorizontal className="h-4.5 w-4.5 h-5 w-5" />
          {chips.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#FF9500] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {chips.length}
            </span>
          )}
        </button>
      </div>

      {/* Faol filtr chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={c.clear}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-[11px] font-semibold"
            >
              {c.label} <X className="h-3 w-3" />
            </button>
          ))}
          <button onClick={resetFilters} className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 hover:text-gray-600">
    Tozalash
          </button>
        </div>
      )}

      {/* Natijalar soni */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {loading ? "Qidirilmoqda..." : `${total} ta e'lon topildi`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <ListingSkeleton count={6} />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <MapPin className="h-12 w-12 text-gray-200 dark:text-zinc-700 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1 text-sm">Hech narsa topilmadi</p>
          <p className="text-xs text-gray-400 mb-4">Filtrlarni o'zgartirib qayta urinib ko'ring</p>
          <button
            onClick={() => { resetFilters(); setQ("") }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white text-xs font-bold rounded-xl"
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
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
                  seller={l.user?.name || undefined}
                  isPremium={l.isPremium}
                  createdAt={l.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/listing/${l.id}`}
                  className="flex gap-3 bg-white dark:bg-zinc-900 rounded-2xl p-2.5 border border-gray-100 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative w-28 h-24 rounded-xl overflow-hidden bg-orange-50 dark:bg-zinc-800 flex-shrink-0">
                    {l.images?.[0] && <img src={l.images[0]} alt="" className="w-full h-full object-cover" />}
                    {l.isPremium && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[8px] font-extrabold rounded-full">VIP</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="text-base font-extrabold text-[#FF9500]">${l.price.toLocaleString("en-US")}</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 leading-snug">{l.title}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {[l.region, l.district].filter(Boolean).join(", ")}
                    </div>
                    {l.user?.name && (
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                        <BadgeCheck className="h-2.5 w-2.5 text-sky-400" /> {l.user.name}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-5">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="h-11 px-7 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto hover:border-[#FF9500] transition-colors"
              >
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                Yana yuklash ({total - listings.length} ta qoldi)
              </button>
            </div>
          )}
        </>
      )}

      {/* FILTER BOTTOM SHEET */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[800] bg-black/40 backdrop-blur-sm" onClick={() => setSheetOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl p-5 pb-8 max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Filtrlar</h3>
              <button onClick={() => setSheetOpen(false)} aria-label="Yopish">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <select value={region} onChange={(e) => { setRegion(e.target.value); setDistrict("") }} className={inputCls}>
                  <option value="">Barcha hududlar</option>
                  {regions.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
                </select>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls} disabled={!region}>
                  <option value="">{region ? "Barcha tumanlar" : "Avval hudud"}</option>
                  {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  <option value="">Barcha turlar</option>
                  {Object.entries(CATEGORY_NAMES).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
                </select>
                <select value={deal} onChange={(e) => setDeal(e.target.value)} className={inputCls}>
                  <option value="">Barcha bitimlar</option>
                  {DEAL_TYPES.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Narx: dan ($)" className={inputCls} />
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Narx: gacha ($)" className={inputCls} />
              </div>

              <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
                <option value="new">Eng yangilari</option>
                <option value="price_asc">Arzon → Qimmat</option>
                <option value="price_desc">Qimmat → Arzon</option>
              </select>

              <div className="flex gap-2.5 pt-1">
                <button onClick={resetFilters} className="flex-1 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold">
                  Tozalash
                </button>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex-1 h-12 bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-400/30"
                >
                  Ko'rish ({total})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
