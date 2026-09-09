"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchFilters from "@/components/SearchFilters"
import { FilterState, DEFAULT_FILTERS } from "@/lib/locations"

export default function Hero() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <section className="relative py-10 sm:py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-orange-300/40 to-amber-400/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-amber-300/40 to-orange-400/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              Uy-joyingizni
            </span>
            <br />
            <span className="text-gray-800">osongina toping</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            O'zbekistonning barcha 14 hududidagi minglab e'lonlar orasidan o'zingizga mosini tanlang.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl shadow-orange-400/10 border border-white/60 p-3 sm:p-4 md:p-6">
          <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearch} showAdvanced={showAdvanced} />

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showAdvanced ? "Kamroq filtrlar" : "Kengaytirilgan qidiruv"}
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-4">
          {[
            { number: "10,000+", label: "E'lonlar" },
            { number: "5,000+", label: "Foydalanuvchilar" },
            { number: "14", label: "Hududlar" },
            { number: "180+", label: "Tumanlar" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 sm:p-4 bg-white/60 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/70 shadow-lg">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}