"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  Home, MapPin, DollarSign, Image as ImageIcon, CheckCircle, 
  ArrowLeft, ArrowRight, Building2, Building, TreePine, 
  Warehouse, Key, Upload, X, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useUploadThing } from "@/lib/uploadthing"
import { REGIONS, getDistricts } from "@/lib/locations"

const listingTypes = [
  { id: "SALE", name: "Sotuv", icon: Home, color: "from-orange-400 to-amber-500" },
  { id: "RENT", name: "Ijara", icon: Key, color: "from-purple-400 to-pink-500" },
  { id: "NEW_BUILDING", name: "Yangi bino", icon: Building, color: "from-blue-400 to-cyan-500" },
]

export default function AddListingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const { startUpload, isUploading } = useUploadThing("listingImage", {
    onClientUploadComplete: (res) => {
      setFormData(prev => ({ ...prev, images: res.map(r => r.url) }))
    },
    onUploadError: (e) => {
      setError("Rasm yuklashda xatolik: " + e.message)
    },
  })

  const [formData, setFormData] = useState({
    type: "", title: "", description: "",
    region: "", district: "", address: "",
    price: "", currency: "USD",
    rooms: "", area: "", floor: "",
    images: [] as string[],
  })

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selected].slice(0, 8))
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      // 1. Rasmlarni yuklash
      let imageUrls: string[] = []
      if (files.length > 0) {
        const res = await startUpload(files)
        if (res) imageUrls = res.map(r => r.url)
      }

      // 2. API'ga yuborish
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "E'lon yaratishda xatolik")
        setLoading(false)
        return
      }

      // 3. Muvaffaqiyat - ro'yxatga o'tish
      router.push("/my-listings")
    } catch (err) {
      setError("Server xatoligi. Qayta urinib ko'ring.")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Yangi e'lon qo'shish
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Bir necha qadamda e'loningizni joylashtiring</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-4 sm:mb-8 bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/70 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] sm:min-w-0">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = step === s.num
              const isCompleted = step > s.num
              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? "bg-green-500 text-white" :
                      isActive ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-400/30" :
                      "bg-gray-200 text-gray-400"
                    }`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-1 font-medium whitespace-nowrap ${isActive ? "text-orange-600" : "text-gray-500"}`}>
                      {s.name}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-400/30 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">E'lon turini tanlang</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {listingTypes.map((type) => {
                  const Icon = type.icon
                  const isSelected = formData.type === type.id
                  return (
                    <button key={type.id} onClick={() => handleChange("type", type.id)}
                      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                        isSelected ? "border-orange-500 bg-orange-50 shadow-lg" : "border-gray-200 bg-white hover:border-orange-300"
                      }`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 rounded-xl bg-gradient-to-br ${type.color} shadow-lg`}>
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                      </div>
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">{type.name}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {formData.type && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-800 font-semibold">E'lon sarlavhasi *</Label>
                    <Input placeholder="Masalan: 3-xonali kvartira, Chilonzor" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-800 font-semibold">Tavsif *</Label>
                    <textarea placeholder="E'lon haqida batafsil ma'lumot..." value={formData.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full px-4 py-3 bg-white/90 border-2 border-white/70 rounded-xl text-gray-900 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 outline-none resize-none" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Joylashuv</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Hudud *</Label>
                  <select value={formData.region} onChange={(e) => { handleChange("region", e.target.value); handleChange("district", "") }} className="w-full h-11 sm:h-12 px-4 bg-white/90 border-2 border-white/70 rounded-xl text-gray-900 focus:border-orange-400 outline-none">
                    <option value="">Tanlang</option>
                    {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Tuman *</Label>
                  <select value={formData.district} onChange={(e) => handleChange("district", e.target.value)} disabled={!formData.region} className="w-full h-11 sm:h-12 px-4 bg-white/90 border-2 border-white/70 rounded-xl text-gray-900 focus:border-orange-400 outline-none disabled:opacity-50">
                    <option value="">Tanlang</option>
                    {getDistricts(REGIONS.find(r => r.name === formData.region)?.id || "").map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800 font-semibold">Manzil</Label>
                <Input placeholder="Ko'cha, uy raqami" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className="h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Xususiyatlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Xonalar</Label>
                  <Input type="number" placeholder="3" value={formData.rooms} onChange={(e) => handleChange("rooms", e.target.value)} className="h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Maydon (m2)</Label>
                  <Input type="number" placeholder="78" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} className="h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Qavat</Label>
                  <Input type="number" placeholder="5" value={formData.floor} onChange={(e) => handleChange("floor", e.target.value)} className="h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Narx</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Narx *</Label>
                  <Input type="number" placeholder="85000" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} className="h-11 sm:h-12 bg-white/90 border-2 border-white/70 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold">Valyuta</Label>
                  <select value={formData.currency} onChange={(e) => handleChange("currency", e.target.value)} className="w-full h-11 sm:h-12 px-4 bg-white/90 border-2 border-white/70 rounded-xl text-gray-900 focus:border-orange-400 outline-none">
                    <option value="USD">USD ($)</option>
                    <option value="UZS">UZS (so'm)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 - RASMLAR */}
          {step === 5 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Rasmlar</h2>
              
              <label className="block border-2 border-dashed border-orange-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Rasmlarni tanlash uchun bosing</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">PNG, JPG (maks. 4MB, 8 tagacha)</p>
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-orange-300 text-orange-600 rounded-xl text-sm font-semibold">
                  <Upload className="h-4 w-4" />
                  Fayl tanlash
                </span>
              </label>

              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/70 shadow-lg bg-orange-100">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                      <button onClick={() => removeFile(i)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600">
                        <X className="h-3 w-3 text-white" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-semibold">Asosiy</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rasmlar yuklanmoqda...
                </div>
              )}
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tasdiqlash</h2>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                <h3 className="font-bold text-lg text-gray-800 mb-3">{formData.title || "Sarlavha yo'q"}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Tur:</span><span className="font-semibold">{listingTypes.find(t => t.id === formData.type)?.name || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Narx:</span><span className="font-bold text-orange-600">{formData.price ? `$${Number(formData.price).toLocaleString()}` : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Joylashuv:</span><span className="font-semibold">{formData.region ? `${formData.region}, ${formData.district}` : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Rasmlar:</span><span className="font-semibold">{files.length} ta</span></div>
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-xs sm:text-sm text-green-700">✅ E'loningiz moderatsiyadan o'tgach saytda ko'rinadi (odatda 24 soat).</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={prevStep} disabled={step === 1} className="border-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Orqaga</span>
            </Button>

            {step < 6 ? (
              <Button onClick={nextStep} disabled={step === 1 && !formData.type} className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold">
                <span className="hidden sm:inline">Keyingi</span>
                <ArrowRight className="h-4 w-4 sm:ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading || isUploading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                {loading || isUploading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Joylanmoqda...</>
                ) : (
                  <><CheckCircle className="h-4 w-4 mr-2" /> E'lonni joylash</>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}