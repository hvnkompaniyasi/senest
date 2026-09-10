"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Home, MapPin, DollarSign, Image as ImageIcon, CheckCircle,
  ArrowLeft, ArrowRight, Building2, Building, TreePine,
  Warehouse, Upload, X, Tag, Loader2, Flame, Droplets, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { REGIONS, getDistricts, PROPERTY_CATEGORIES, DEAL_TYPES } from "@/lib/locations"
import { useUploadThing } from "@/lib/uploadthing"

const categoryIcons: Record<string, any> = {
  APARTMENT: Building2, HOUSE: Home, OFFICE: Building, LAND: TreePine, WAREHOUSE: Warehouse,
}
const categoryColors: Record<string, string> = {
  APARTMENT: "from-orange-400 to-amber-500",
  HOUSE: "from-amber-400 to-yellow-500",
  OFFICE: "from-orange-500 to-red-500",
  LAND: "from-green-400 to-emerald-500",
  WAREHOUSE: "from-blue-400 to-cyan-500",
}

const UTILITIES = [
  { key: "hasGas", label: "Gaz", emoji: "🔥", icon: Flame },
  { key: "hasWater", label: "Suv", emoji: "💧", icon: Droplets },
  { key: "hasElectricity", label: "Elektr", emoji: "💡", icon: Zap },
]

interface FileWithPreview { file: File; preview: string }

export default function AddListingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const { startUpload, isUploading } = useUploadThing("listingImage", {
    onUploadError: (e) => setError("Rasm yuklashda xatolik: " + e.message),
  })

  const [formData, setFormData] = useState({
    category: "", deal: "", title: "", description: "",
    region: "", district: "", address: "",
    price: "", rooms: "", area: "", floor: "", totalFloors: "",
    hasGas: false, hasWater: false, hasElectricity: false,
    landArea: "", landStatus: "",
  })

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">E'lon qo'shish uchun tizimga kiring</h1>
          <Button onClick={() => router.push("/login")} className="bg-gradient-to-r from-orange-400 to-amber-500">Kirish</Button>
        </div>
        <Footer />
      </div>
    )
  }

  const handleChange = (field: string, value: unknown) => setFormData(prev => ({ ...prev, [field]: value }))

  const isBuildingType = ["APARTMENT", "HOUSE", "OFFICE"].includes(formData.category)

  const canNext = (): boolean => {
    switch (step) {
      case 1: return !!formData.category && !!formData.deal
      case 2: return !!formData.region
      case 3: return isBuildingType ? (!!formData.rooms && !!formData.floor && !!formData.totalFloors) : true
      case 4: return !!formData.price
      case 5: return files.length > 0
      default: return true
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selected.map(f => ({ file: f, preview: URL.createObjectURL(f) }))].slice(0, 8))
  }
  const removeFile = (i: number) => setFiles(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i) })
  const moveFile = (i: number, dir: -1 | 1) => setFiles(prev => {
    const next = [...prev]; const j = i + dir
    if (j < 0 || j >= next.length) return prev
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
  })

  const handleSubmit = async () => {
    setLoading(true); setError("")
    try {
      let imageUrls: string[] = []
      if (files.length > 0) {
        const res = await startUpload(files.map(f => f.file))
        if (!res || res.length === 0) { setError("Rasmlarni yuklab bo'lmadi. Qayta urinib ko'ring."); return }
        imageUrls = res.map(r => (r as { ufsUrl?: string; url: string }).ufsUrl || r.url)
      }
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title, description: formData.description,
          type: formData.deal, category: formData.category,
          region: formData.region, district: formData.district, address: formData.address,
          price: formData.price, currency: "USD",
          rooms: formData.rooms || null,
          area: formData.category === "LAND" ? formData.landArea : formData.area,
          floor: formData.floor || null, totalFloors: formData.totalFloors || null,
          hasGas: formData.hasGas, hasWater: formData.hasWater, hasElectricity: formData.hasElectricity,
          images: imageUrls,
        }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || "Xatolik"); return }
      router.push("/my-listings")
    } catch {
      setError("Tizimda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { num: 1, name: "Asosiy", icon: Home },
    { num: 2, name: "Joylashuv", icon: MapPin },
    { num: 3, name: "Xususiyatlar", icon: Building2 },
    { num: 4, name: "Narx", icon: DollarSign },
    { num: 5, name: "Rasmlar", icon: ImageIcon },
    { num: 6, name: "Tasdiqlash", icon: CheckCircle },
  ]

  const inputCls = "h-12 bg-white/90 border-2 border-white/70 rounded-xl"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">Yangi e'lon qo'shish</h1>
          <p className="text-sm sm:text-base text-gray-600">Yulduzcha (*) bilan belgilangan maydonlar majburiy</p>
        </div>

        <div className="mb-4 sm:mb-8 bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/70 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] sm:min-w-0">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = step === s.num
              const isCompleted = step > s.num
              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-1 font-medium whitespace-nowrap ${isActive ? "text-orange-600" : "text-gray-500"}`}>{s.name}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Kategoriya *</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {PROPERTY_CATEGORIES.map((cat) => {
                    const Icon = categoryIcons[cat.id]
                    const sel = formData.category === cat.id
                    return (
                      <button key={cat.id} onClick={() => handleChange("category", cat.id)} className={`relative p-4 rounded-xl border-2 transition-all text-center ${sel ? "border-orange-500 bg-orange-50 shadow-lg" : "border-gray-200 bg-white hover:border-orange-300"}`}>
                        <div className={`inline-flex items-center justify-center w-12 h-12 mb-2 rounded-xl bg-gradient-to-br ${categoryColors[cat.id]} shadow-lg`}><Icon className="h-6 w-6 text-white" /></div>
                        <div className="font-semibold text-gray-800 text-sm">{cat.name}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Tag className="h-5 w-5 text-orange-500" /> Bitim turi *</h2>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {DEAL_TYPES.map((d) => (
                    <button key={d.id} onClick={() => handleChange("deal", d.id)} className={`p-4 rounded-xl border-2 transition-all font-semibold ${formData.deal === d.id ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg" : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"}`}>{d.name}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">E'lon sarlavhasi (ixtiyoriy)</Label>
                <Input placeholder="Masalan: 3-xonali kvartira, Chilonzor" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Tavsif (ixtiyoriy)</Label>
                <textarea placeholder="E'lon haqida qisqacha..." value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full px-4 py-3 bg-white/90 border-2 border-white/70 rounded-xl focus:border-orange-400 outline-none resize-none" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Joylashuv</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-semibold">Region *</Label>
                  <select value={formData.region} onChange={(e) => { handleChange("region", e.target.value); handleChange("district", "") }} className={`w-full ${inputCls} px-4`}>
                    <option value="">Tanlang</option>
                    {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Tuman (ixtiyoriy)</Label>
                  <select value={formData.district} onChange={(e) => handleChange("district", e.target.value)} disabled={!formData.region} className={`w-full ${inputCls} px-4 disabled:opacity-50`}>
                    <option value="">Tanlang</option>
                    {getDistricts(formData.region).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Manzil (ixtiyoriy)</Label>
                <Input placeholder="Ko'cha, uy raqami" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className={inputCls} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Xususiyatlar</h2>
              {isBuildingType && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="font-semibold">Xonalar soni *</Label><Input type="number" placeholder="3" value={formData.rooms} onChange={(e) => handleChange("rooms", e.target.value)} className={inputCls} /></div>
                  <div className="space-y-2"><Label className="font-semibold">Maydon (m2)</Label><Input type="number" placeholder="78" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} className={inputCls} /></div>
                  <div className="space-y-2"><Label className="font-semibold">Qavat *</Label><Input type="number" placeholder="5" value={formData.floor} onChange={(e) => handleChange("floor", e.target.value)} className={inputCls} /></div>
                  <div className="space-y-2"><Label className="font-semibold">Jami qavatlar *</Label><Input type="number" placeholder="9" value={formData.totalFloors} onChange={(e) => handleChange("totalFloors", e.target.value)} className={inputCls} /></div>
                </div>
              )}
              {formData.category === "LAND" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="font-semibold">Maydon (sotix)</Label><Input type="number" placeholder="6" value={formData.landArea} onChange={(e) => handleChange("landArea", e.target.value)} className={inputCls} /></div>
                  <div className="space-y-2"><Label className="font-semibold">Status</Label>
                    <select value={formData.landStatus} onChange={(e) => handleChange("landStatus", e.target.value)} className={`w-full ${inputCls} px-4`}>
                      <option value="">Tanlang</option><option value="residential">Turar joy</option><option value="agricultural">Qishloq xo'jaligi</option><option value="commercial">Tijorat</option>
                    </select>
                  </div>
                </div>
              )}
              {formData.category === "WAREHOUSE" && (
                <div className="space-y-2"><Label className="font-semibold">Maydon (m2)</Label><Input type="number" placeholder="500" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} className={inputCls} /></div>
              )}

              <div className="space-y-2">
                <Label className="font-semibold">Kommunikatsiyalar</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {UTILITIES.map((u) => {
                    const val = formData[u.key as keyof typeof formData] as boolean
                    return (
                      <div key={u.key} className="p-3 bg-white/90 border-2 border-white/70 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{u.emoji}</span>
                          <span className="text-sm font-medium text-gray-700">{u.label}</span>
                        </div>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => handleChange(u.key, true)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${val ? "bg-green-500 text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>✓ Bor</button>
                          <button type="button" onClick={() => handleChange(u.key, false)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${!val ? "bg-red-500 text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>✕ Yo'q</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Narx</h2>
              <div className="space-y-2 max-w-md">
                <Label className="font-semibold">{formData.deal === "RENT" ? "Oylik narx ($) *" : "Narx ($) *"}</Label>
                <Input type="number" placeholder={formData.deal === "RENT" ? "450" : "85000"} value={formData.price} onChange={(e) => handleChange("price", e.target.value)} className={inputCls} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Rasmlar *</h2>
              {files.length === 0 && <p className="text-sm text-red-600">Kamida 1 ta rasm yuklash majburiy</p>}
              <label className="block border-2 border-dashed border-orange-300 rounded-xl p-6 sm:p-8 text-center bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Rasmlarni tanlash uchun bosing</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">PNG, JPG (maks. 4MB, 8 tagacha)</p>
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-orange-300 text-orange-600 rounded-xl text-sm font-semibold">Fayl tanlash</span>
              </label>
              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {files.map((f, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/70 shadow-lg bg-orange-100 group">
                      <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-full font-bold z-10">Asosiy</div>}
                      <div className="absolute inset-0 bg-black/50 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button type="button" onClick={() => moveFile(i, -1)} aria-label="Chapga surish" className="w-7 h-7 bg-white/20 rounded-full text-white text-xs hover:bg-white/30">←</button>
                        <button type="button" onClick={() => moveFile(i, 1)} aria-label="O'ngga surish" className="w-7 h-7 bg-white/20 rounded-full text-white text-xs hover:bg-white/30">→</button>
                        <button type="button" onClick={() => removeFile(i)} aria-label="Rasmni o'chirish" className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"><X className="h-3.5 w-3.5 text-white" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isUploading && <div className="flex items-center gap-2 text-orange-600 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Rasmlar yuklanmoqda...</div>}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tasdiqlash</h2>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Sarlavha:</span><span className="font-semibold">{formData.title || "(sarlavhasiz)"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Kategoriya:</span><span className="font-semibold">{PROPERTY_CATEGORIES.find(c => c.id === formData.category)?.name || "-"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Bitim turi:</span><span className="font-semibold">{DEAL_TYPES.find(d => d.id === formData.deal)?.name || "-"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Narx:</span><span className="font-bold text-orange-600">{formData.price ? `$${Number(formData.price).toLocaleString()}` : "-"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Rasmlar:</span><span className="font-semibold">{files.length} ta</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Kommunikatsiyalar:</span>
                  <span className="font-semibold">
                    {UTILITIES.map(u => `${u.emoji}${(formData[u.key as keyof typeof formData] as boolean) ? "✓" : "✕"}`).join("  ")}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-sm text-green-700">E'lon moderatsiyadan o'tgach saytda ko'rinadi.</div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="border-gray-300"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
            {step < 6 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold">Keyingi <ArrowRight className="h-4 w-4 ml-2" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading || isUploading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                {loading || isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Joylanmoqda...</> : <><CheckCircle className="h-4 w-4 mr-2" /> E'lonni joylash</>}
              </Button>
            )}
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
