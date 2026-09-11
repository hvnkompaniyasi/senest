"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Plus } from "lucide-react"

const DEALS = [
  { id: "", label: "Barchasi" },
  { id: "SALE", label: "Sotib olish" },
  { id: "RENT", label: "Ijaraga" },
]

export default function Hero() {
  const router = useRouter()
  const [deal, setDeal] = useState("")
  const [q, setQ] = useState("")

  const submit = () => {
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    if (deal) params.set("deal", deal)
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <section className="pt-4 pb-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-900 rounded-full text-[11px] font-semibold text-gray-600 dark:text-gray-300 shadow-[0_4px_16px_rgba(0,0,0,0.05)] mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        O'zbekiston bo'ylab ishonchli e'lonlar
      </div>

      <h1 className="text-[26px] sm:text-4xl leading-tight font-extrabold text-gray-900 dark:text-white">
        Uy-joyingizni{" "}
        <span className="bg-gradient-to-r from-[#FF9500] to-[#FF6A00] bg-clip-text text-transparent">
          osongina
        </span>{" "}
        toping
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 mb-4">
        Minglab tasdiqlangan e'lonlar — bitta qidiruvda
      </p>

      {/* Qidiruv kartasi */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-2.5 shadow-[0_8px_30px_rgba(255,149,0,0.10)] border border-orange-100/70 dark:border-zinc-800">
        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-2.5">
          {DEALS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDeal(d.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                deal === d.id
                  ? "bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Hudud, manzil yoki sarlavha..."
            className="h-12 w-full pl-10 pr-24 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-[#FF9500]"
          />
          <button
            onClick={submit}
            className="absolute right-1.5 top-1.5 h-9 px-4 bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white rounded-lg text-sm font-bold shadow-md shadow-orange-400/30 active:scale-95 transition-transform"
          >
            Qidirish
          </button>
        </div>
      </div>

      {/* Tez chips */}
      <div className="flex gap-2 mt-3">
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
        >
          <MapPin className="h-3.5 w-3.5 text-[#FF9500]" /> Xaritada ko'rish
        </Link>
        <Link
          href="/add-listing"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-400"
        >
          <Plus className="h-3.5 w-3.5" /> E'lon qo'shish — bepul
        </Link>
      </div>
    </section>
  )
}
