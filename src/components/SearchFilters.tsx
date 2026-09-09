"use client"

import { MapPin, Home, DollarSign, Search, Maximize, Bed, ArrowUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { REGIONS, getDistricts, PROPERTY_CATEGORIES, ROOM_OPTIONS, SORT_OPTIONS, FilterState, DEFAULT_FILTERS } from "@/lib/locations"

interface SearchFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onSearch: () => void
  showAdvanced?: boolean
}

const selectClass = "w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-8 bg-white/90 border-2 border-white/70 rounded-lg sm:rounded-xl text-gray-800 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 outline-none transition-all font-medium text-sm sm:text-base appearance-none cursor-pointer"

const inputClass = "w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-3 bg-white/90 border-2 border-white/70 rounded-lg sm:rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 outline-none transition-all font-medium text-sm sm:text-base"

export default function SearchFilters({ filters, onChange, onSearch, showAdvanced = false }: SearchFiltersProps) {
  const set = (field: keyof FilterState, value: string) => {
    onChange({ ...filters, [field]: value })
  }

  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== "sortBy").length

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
          <select value={filters.region} onChange={(e) => onChange({ ...filters, region: e.target.value, district: "" })} className={selectClass}>
            <option value="">Barcha hududlar</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
          <select value={filters.district} onChange={(e) => set("district", e.target.value)} disabled={!filters.region} className={selectClass + " disabled:opacity-50"}>
            <option value="">{filters.region ? "Barcha tumanlar" : "Avval hudud tanlang"}</option>
            {getDistricts(filters.region).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
          <select value={filters.category} onChange={(e) => set("category", e.target.value)} className={selectClass}>
            <option value="">Barcha turlar</option>
            {PROPERTY_CATEGORIES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <Button onClick={onSearch} className="w-full h-11 sm:h-12 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg shadow-orange-400/30 hover:shadow-orange-400/50 transition-all text-sm sm:text-base">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Qidirish
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 border-t border-orange-100">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <input type="number" placeholder="Narxdan ($)" value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <input type="number" placeholder="Narxgacha ($)" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <select value={filters.rooms} onChange={(e) => set("rooms", e.target.value)} className={selectClass}>
              <option value="">Xonalar soni</option>
              {ROOM_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <select value={filters.sortBy} onChange={(e) => set("sortBy", e.target.value)} className={selectClass}>
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <input type="number" placeholder="Maydondan (m2)" value={filters.minArea} onChange={(e) => set("minArea", e.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500 pointer-events-none z-10" />
            <input type="number" placeholder="Maydongacha (m2)" value={filters.maxArea} onChange={(e) => set("maxArea", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <Button variant="outline" onClick={() => onChange(DEFAULT_FILTERS)} className="flex-1 h-11 sm:h-12 border-gray-300 text-sm">
              <X className="h-4 w-4 mr-2" />
              Tozalash
            </Button>
            {activeCount > 0 && (
              <span className="px-3 py-1.5 bg-orange-100 border border-orange-200 rounded-full text-xs font-semibold text-orange-700 whitespace-nowrap">
                {activeCount} ta filtr faol
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}