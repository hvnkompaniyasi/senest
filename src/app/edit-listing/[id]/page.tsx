"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, Loader2, Send, Info } from "lucide-react"
import Navbar from "@/components/Navbar"
import { REGIONS } from "@/lib/locations"

interface EditListing {
  id: string
  title: string
  description: string
  price: number
  region: string
  district: string
  address: string
  rooms: number | null
  area: number | null
  floor: number | null
  totalFloors: number | null
  hasGas: boolean
  hasWater: boolean
  hasElectricity: boolean
  status: string
}

const inputCls =
  "h-12 w-full px-4 bg-white/90 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-orange-400"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const id = String(params.id || "")

  const [listing, setListing] = useState<EditListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    region: "",
    district: "",
    address: "",
    rooms: "",
    area: "",
    floor: "",
    totalFloors: "",
    hasGas: false,
    hasWater: false,
    hasElectricity: false,
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/login?callbackUrl=/edit-listing/${id}`)
  }, [status, router, id])

  useEffect(() => {
    if (!id || !session) return
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const l = d.listing || d
        if (!l || !l.id) {
          setError("E'lon topilmadi")
          return
        }
        setListing(l)
        setForm({
          title: l.title || "",
          description: l.description || "",
          price: String(l.price || ""),
          region: l.region || "",
          district: l.district || "",
          address: l.address || "",
          rooms: l.rooms != null ? String(l.rooms) : "",
          area: l.area != null ? String(l.area) : "",
          floor: l.floor != null ? String(l.floor) : "",
          totalFloors: l.totalFloors != null ? String(l.totalFloors) : "",
          hasGas: !!l.hasGas,
          hasWater: !!l.hasWater,
          hasElectricity: !!l.hasElectricity,
        })
      })
      .catch(() => setError("E'lonni yuklab bo'lmadi"))
      .finally(() => setLoading(false))
  }, [id, session])

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = async () => {
    setError("")
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        region: form.region,
        district: form.district || undefined,
        address: form.address || undefined,
        hasGas: form.hasGas,
        hasWater: form.hasWater,
        hasElectricity: form.hasElectricity,
      }
      if (form.rooms !== "") payload.rooms = Number(form.rooms)
      if (form.area !== "") payload.area = Number(form.area)
      if (form.floor !== "") payload.floor = Number(form.floor)
      if (form.totalFloors !== "") payload.totalFloors = Number(form.totalFloors)

      const res = await fetch(`/api/listings/${id}/edit-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const d = await res.json()
      if (!res.ok) {
        setError(d.error || "Xatolik")
        return
      }
      router.push("/my-listings")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 pb-24 lg:pb-10">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/my-listings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 hover:text-orange-600">
          <ArrowLeft className="h-4 w-4" /> Mening e'lonlarim
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">E'lonni tahrirlash</h1>

        <div className="mb-5 p-3.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl flex gap-2.5">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            O'zgarishlar moderator tekshiruvidan so'ng qo'llaniladi. Ko'rik paytida e'lonning hozirgi holati saytda qoladi.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-5 shadow-lg">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Sarlavha *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Masalan: 3 xonali kvartira sotiladi" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Tavsif</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className={`${inputCls} h-auto py-3 resize-none`} placeholder="E'lon haqida batafsil..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Narx ($) *</label>
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="45000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Hudud *</label>
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className={inputCls}>
                <option value="">Tanlang</option>
                {REGIONS.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Tuman / shahar</label>
              <input value={form.district} onChange={(e) => set("district", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Manzil</label>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Xonalar</label>
              <input type="number" value={form.rooms} onChange={(e) => set("rooms", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Maydon (m²)</label>
              <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Qavat</label>
              <input type="number" value={form.floor} onChange={(e) => set("floor", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">Jami qavat</label>
              <input type="number" value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { key: "hasGas" as const, label: "Gaz bor" },
              { key: "hasWater" as const, label: "Suv bor" },
              { key: "hasElectricity" as const, label: "Elektr bor" },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[item.key]}
                  onChange={(e) => set(item.key, e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={saving || !form.title || !form.price || !form.region}
            className="h-12 w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-400/30 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            O'zgarishlarni yuborish
          </button>
        </div>
      </div>
    </div>
  )
}
