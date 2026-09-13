"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useUploadThing } from "@/lib/uploadthing"
import {
  ArrowLeft, Loader2, Send, Info, UploadCloud, X, ChevronLeft, ChevronRight, Star,
  CheckCircle,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"
import LocationPicker from "@/components/LocationPicker"
import { REGIONS } from "@/lib/locations"

const CATEGORIES = [
  { id: "APARTMENT", name: "Kvartira" },
  { id: "HOUSE", name: "Uy / Hovli" },
  { id: "OFFICE", name: "Ofis" },
  { id: "LAND", name: "Yer" },
  { id: "WAREHOUSE", name: "Ombor" },
]

const DEALS = [
  { id: "SALE", name: "Sotiladi" },
  { id: "RENT", name: "Ijaraga" },
  { id: "NEW_BUILDING", name: "Yangi qurilish" },
  { id: "DAILY", name: "Kunlik" },
]

interface Region {
  id: string
  name: string
  districts?: string[]
}

interface FormState {
  title: string
  description: string
  price: string
  category: string
  type: string
  images: string[]
  region: string
  district: string
  address: string
  lat: number | null
  lng: number | null
  rooms: string
  area: string
  floor: string
  totalFloors: string
  hasGas: boolean
  hasWater: boolean
  hasElectricity: boolean
}

const emptyForm: FormState = {
  title: "",
  description: "",
  price: "",
  category: "APARTMENT",
  type: "SALE",
  images: [],
  region: "",
  district: "",
  address: "",
  lat: null,
  lng: null,
  rooms: "",
  area: "",
  floor: "",
  totalFloors: "",
  hasGas: false,
  hasWater: false,
  hasElectricity: false,
}

const inputCls =
  "h-12 w-full px-4 bg-white/90 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:border-[#FF9500]"

const labelCls = "text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const id = String(params.id || "")

  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("listingImage", {
    onClientUploadComplete: (res) => {
      const urls = (res || []).map((r: { url: string }) => r.url)
      setForm((f) => ({ ...f, images: [...f.images, ...urls].slice(0, 10) }))
    },
    onUploadError: (e: Error) => setError(e.message || "Rasm yuklashda xato"),
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/login?callbackUrl=/edit-listing/${id}`)
  }, [status, router, id])

  // Mavjud e'lonni yuklash
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
        setForm({
          title: l.title || "",
          description: l.description || "",
          price: String(l.price || ""),
          category: l.category || "APARTMENT",
          type: l.type || "SALE",
          images: l.images || [],
          region: l.region || "",
          district: l.district || "",
          address: l.address || "",
          lat: l.latitude ?? null,
          lng: l.longitude ?? null,
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

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const regions = REGIONS as Region[]
  const districts = regions.find((r) => r.name === form.region)?.districts || []

  const onFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (arr.length === 0) return
    if (form.images.length + arr.length > 10) {
      setError("Maksimum 10 ta rasm")
      return
    }
    setError("")
    void startUpload(arr)
  }

  const moveImage = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const imgs = [...f.images]
      const target = index + dir
      if (target < 0 || target >= imgs.length) return f
      ;[imgs[index], imgs[target]] = [imgs[target], imgs[index]]
      return { ...f, images: imgs }
    })
  }

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const submit = async () => {
    setError("")
    if (!form.title.trim()) return setError("Sarlavhani kiriting")
    if (!form.price || Number(form.price) <= 0) return setError("Narxni to'g'ri kiriting")
    if (!form.region) return setError("Hududni tanlang")
    if (form.images.length === 0) return setError("Kamida 1 ta rasm qoldiring")

    setSaving(true)
    try {
      const res = await fetch(`/api/listings/${id}/edit-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
          type: form.type,
          images: form.images,
          region: form.region,
          district: form.district || undefined,
          address: form.address || undefined,
          latitude: form.lat,
          longitude: form.lng,
          rooms: form.rooms === "" ? null : Number(form.rooms),
          area: form.area === "" ? null : Number(form.area),
          floor: form.floor === "" ? null : Number(form.floor),
          totalFloors: form.totalFloors === "" ? null : Number(form.totalFloors),
          hasGas: form.hasGas,
          hasWater: form.hasWater,
          hasElectricity: form.hasElectricity,
        }),
      })
      const d = await res.json()
      if (!res.ok) {
        setError(d.error || "Xatolik")
        return
      }
      setDone(true)
      window.scrollTo({ top: 0 })
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9] dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9500]" />
      </div>
    )
  }
  if (!session) return null

  // ===== HOLAT OYNASI =====
  if (done) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950 flex items-center justify-center px-4 pb-24">
        <div className="max-w-sm w-full bg-white dark:bg-zinc-900 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1.5">
            O'zgarishlar yuborildi!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
            O'zgarishlaringiz moderator tekshiruviga yuborildi. Tasdiqlangach e'lon yangilanadi va bildirishnoma olasiz.
          </p>
          <button
            onClick={() => router.push("/my-listings")}
            className="h-12 w-full bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white rounded-xl font-bold text-sm"
          >
            E'lonlarimni ko'rish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950 pb-24 lg:pb-10">
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        <Link href="/my-listings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#FF9500]">
          <ArrowLeft className="h-4 w-4" /> E'lonlarim
        </Link>

        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl flex gap-2.5">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            O'zgarishlar moderator tekshiruvidan so'ng qo'llaniladi. Ko'rik paytida e'lonning hozirgi holati saytda qoladi.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* BITIM TURI */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
            {DEALS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => set("type", d.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  form.type === d.id
                    ? "bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* KATEGORIYA */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <label className={labelCls}>Kategoriya *</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set("category", c.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-colors ${
                  form.category === c.id
                    ? "bg-[#FF9500] border-[#FF9500] text-white shadow-md shadow-orange-400/30"
                    : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* ASOSIY */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-3">
          <div>
            <label className={labelCls}>Sarlavha *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={100} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tavsif</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} maxLength={2000} className={`${inputCls} h-auto py-3 resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Narx ($) *</label>
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* RASMLAR */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <label className={labelCls}>Rasmlar * (maks. 10)</label>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-[#FF9500] bg-orange-50 dark:bg-orange-500/10"
                : "border-gray-200 dark:border-zinc-700 hover:border-[#FF9500]/60"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { if (e.target.files) onFiles(e.target.files); e.target.value = "" }}
            />
            {isUploading ? (
              <div className="w-full max-w-xs mx-auto">
                <Loader2 className="h-6 w-6 animate-spin text-[#FF9500] mx-auto mb-2" />
                <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF9500] to-[#FF7A00] animate-pulse" style={{ width: "70%" }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Yuklanmoqda...</p>
              </div>
            ) : (
              <>
                <UploadCloud className="h-7 w-7 text-gray-300 dark:text-zinc-600 mx-auto mb-1.5" />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Rasm qo'shish</p>
                <p className="text-[11px] text-gray-400 mt-0.5">shu yerga tashlang yoki bosing</p>
              </>
            )}
          </div>

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {form.images.map((img, i) => (
                <div key={img + i} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700">
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#FF9500] text-white text-[9px] font-bold rounded flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-current" /> Asosiy
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 flex items-center justify-center gap-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-1 text-white disabled:opacity-30" aria-label="Chapga">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => removeImage(i)} className="p-1 text-red-400" aria-label="O'chirish">
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="p-1 text-white disabled:opacity-30" aria-label="O'ngga">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JOYLASHUV + XARITA */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelCls}>Hudud *</label>
              <select value={form.region} onChange={(e) => { set("region", e.target.value); set("district", "") }} className={inputCls}>
                <option value="">Tanlang</option>
                {regions.map((r) => (<option key={r.id} value={r.name}>{r.name}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tuman / shahar</label>
              <select value={form.district} onChange={(e) => set("district", e.target.value)} className={inputCls} disabled={!form.region}>
                <option value="">{form.region ? "Tanlang" : "Avval hudud"}</option>
                {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Manzil</label>
            <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Aniq joylashuv (xaritada belgilang / o'zgartiring)</label>
            <LocationPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))} />
          </div>
        </div>

        {/* XUSUSIYATLAR */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className={labelCls}>Xonalar</label>
              <input type="number" value={form.rooms} onChange={(e) => set("rooms", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Maydon m²</label>
              <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Qavat</label>
              <input type="number" value={form.floor} onChange={(e) => set("floor", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Jami qavat</label>
              <input type="number" value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              { key: "hasGas" as const, label: "Gaz bor" },
              { key: "hasWater" as const, label: "Suv bor" },
              { key: "hasElectricity" as const, label: "Elektr bor" },
            ]).map((item) => (
              <label key={item.key} className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl cursor-pointer">
                <input type="checkbox" checked={form[item.key]} onChange={(e) => set(item.key, e.target.checked)} className="w-4 h-4 accent-[#FF9500]" />
                <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={saving || isUploading}
          className="h-14 w-full bg-gradient-to-r from-[#FF9500] to-[#FF7A00] hover:from-[#FF8A00] hover:to-[#FF6A00] text-white rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-400/30 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          O'zgarishlarni yuborish
        </button>
      </div>

      <MobileNav />
    </div>
  )
}
