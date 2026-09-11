"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Home, Loader2 } from "lucide-react"

interface Suggestion {
  type: string
  label: string
  href: string
  meta?: string
}

export default function SmartSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (q.trim().length < 2) {
      setSuggestions([])
      return
    }
    setLoading(true)
    const t = setTimeout(() => {
      fetch(`/api/suggestions?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => {
          setSuggestions(d.suggestions || [])
          setOpen(true)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    if (q.trim()) router.push(`/listings?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div ref={boxRef} className="relative">
      <form onSubmit={submit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Qidirish: sarlavha, manzil, hudud..."
            className="w-full h-13 pl-12 pr-11 py-3.5 bg-white/90 dark:bg-zinc-900/90 border-2 border-white/70 dark:border-zinc-800 rounded-2xl text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 outline-none shadow-lg transition-all text-sm sm:text-base"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-orange-500" />
          )}
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-30 animate-scale-in">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false)
                setQ("")
                router.push(s.href)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-zinc-800 text-left transition-colors border-b border-gray-50 dark:border-zinc-800/50 last:border-0"
            >
              {s.type === "region" ? (
                <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
              ) : (
                <Home className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{s.label}</div>
                {s.meta && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.meta}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
