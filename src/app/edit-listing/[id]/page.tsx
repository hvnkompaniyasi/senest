"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Save, Loader2, Upload, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { REGIONS, PROPERTY_CATEGORIES, DEAL_TYPES } from "@/lib/locations"
import { useUploadThing } from "@/lib/uploadthing"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [images, setImages] = useState<string[]>([])

  const [form, setForm] = useState({
    title: "", description: "", price: "", region: "", district: "", address: "",
    rooms: "", area: "", floor: "", totalFloors: "", category: "", type: "",
    hasGas: false, hasWater: false, hasElectricity: false,
  })

  const { startUpload, isUploading } = useUploadThing("listingImage", {
    onUploadError: (e) => setError("Rasm yuklashda xatolik: " + e.message),
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/listings/${id}/edit`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const l = data.listing
      setForm({
        title: l.title || "", description: l.description || "", price: String(l.price ?? ""),
        region: l.region || "", district: l.district || "", address: l.address || "",
        rooms: l.rooms ? String(l.rooms) : "", area: l.area ? String(l.area) : "",
        floor: l.floor ? String(l.floor) : "", totalFloors: l.totalFloors ? String(l.totalFloors) : "",
        category: l.category || "", type: l.type || "",
        hasGas: !!l.hasGas, hasWater: !!l.hasWater, hasElectricity: !!l.hasElectricity,
      })
      setImages(l.images || [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (status === "authenticated") load()
    else if (status === "unauthenticated") router.push("/login")
  }, [status, load, router])

  const set = (f: string, v: unknown) => setForm(p => ({ ...p, [f]: v }))

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    try {
      const res = await startUpload(files)
      if (res) setImages(prev => [...prev, ...res.map(r => (r as { ufsUrl?: string; url: string }).ufsUrl || r.url)])
    } catch { setError("Rasm yuklashda xatolik") }
    e.target.value = ""
  }

  const submit = async () => {
    setSaving(true); setError(""); setSuccess("")
    try {
      const res = await fetch(`/api/listings/${id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess("O'zgarishlar moderatsiyaga yuborildi! Admin tasdiqlagach qo'llanadi.")
      setTimeout(() => router.push("/my-listings"), 1800)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <button onClick={() => router.push("/my-listings")} className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Orqaga
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">E'lonni tahrirlash</h1>
        <p className="text-sm text-gray-600 mb-6">O'zgarishlar moderatsiyadan o'tgach qo'llanadi</p>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Sarlavha</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Tavsif</Label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full px-4 py-3 bg-white/90 border-2 border-white/70 rounded-xl focus:border-orange-400 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2"><Label className="font-semibold">Narx ($)</Label><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-semibold">Hudud</Label>
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className="w-full h-12 px-4 bg-white/90 border-2 border-white/70 rounded-xl">
                <option value="">Tanlang</option>
                {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label className="font-semibold">Tuman</Label><Input value={form.district} onChange={(e) => set("district", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-semibold">Manzil</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-semibold">Xonalar</Label><Input type="number" value={form.rooms} onChange={(e) => set("rooms", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-semibold">Maydon (m2)</Label><Input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-semibold">Kategoriya</Label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full h-12 px-4 bg-white/90 border-2 border-white/70 rounded-xl">
                {PROPERTY_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label className="font-semibold">Bitim turi</Label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full h-12 px-4 bg-white/90 border-2 border-white/70 rounded-xl">
                {DEAL_TYPES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="font-semibold">Jami qavatlar</Label>
              <Input type="number" value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} className="h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Kommunikatsiyalar</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "hasGas", label: "Gaz", emoji: "🔥" },
                { key: "hasWater", label: "Suv", emoji: "💧" },
                { key: "hasElectricity", label: "Elektr", emoji: "💡" },
              ].map((u) => {
                const val = form[u.key as keyof typeof form] as boolean
                return (
                  <div key={u.key} className="p-3 bg-white/90 border-2 border-white/70 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{u.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{u.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => set(u.key, true)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${val ? "bg-green-500 text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>✓ Bor</button>
                      <button type="button" onClick={() => set(u.key, false)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${!val ? "bg-red-500 text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>✕ Yo'q</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Rasmlar ({images.length})</Label>
              <label className="inline-flex items-center gap-2 px-3 py-2 border-2 border-orange-300 text-orange-600 rounded-xl text-sm font-semibold cursor-pointer hover:bg-orange-50">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Rasm qo'shish
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-white/70">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={submit} disabled={saving || isUploading} className="w-full h-12 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Moderatsiyaga yuborish
          </Button>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
