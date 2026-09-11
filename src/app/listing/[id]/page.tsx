import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, Bed, Maximize, Layers, Phone, MessageCircle, ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ImageGallery from "@/components/ImageGallery"
import ShareButton from "@/components/ShareButton"
import { prisma } from "@/lib/auth"
import { PROPERTY_CATEGORIES, DEAL_TYPES } from "@/lib/locations"

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } })
  return { title: listing ? `${listing.title} - Senest` : "E'lon topilmadi - Senest" }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, phone: true } } },
  })

  if (!listing || listing.status !== "ACTIVE") {
    notFound()
  }

  const categoryName = PROPERTY_CATEGORIES.find((c) => c.id === listing.category)?.name || listing.category
  const dealName = DEAL_TYPES.find((d) => d.id === listing.type)?.name || listing.type

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link href="/listings" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4 sm:mb-6 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" />
          Barcha e'lonlarga qaytish
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={listing.images} title={listing.title} />

            <div className="flex items-center justify-between mt-4 gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-orange-100 border border-orange-200 rounded-full text-xs font-semibold text-orange-700">
                  🛡️ Tasdiqlangan e'lon
                </span>
              </div>
              <ShareButton title={listing.title} />
            </div>

            <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-orange-100 border border-orange-200 rounded-full text-xs font-semibold text-orange-700">
                  {dealName}
                </span>
                <span className="px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
                  {categoryName}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
                <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>{[listing.region, listing.district, listing.address].filter(Boolean).join(", ")}</span>
              </div>

              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                ${listing.price.toLocaleString("en-US")}
                {listing.type === "RENT" && <span className="text-base font-medium text-gray-500"> / oy</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {listing.rooms ? (
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <Bed className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Xonalar</div>
                    <div className="font-bold text-gray-800">{listing.rooms}</div>
                  </div>
                ) : null}
                {listing.area ? (
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <Maximize className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Maydon</div>
                    <div className="font-bold text-gray-800">{listing.area} m²</div>
                  </div>
                ) : null}
                {listing.floor ? (
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <Layers className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Qavat</div>
                    <div className="font-bold text-gray-800">{listing.floor}</div>
                  </div>
                ) : null}
                <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                  <MapPin className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Hudud</div>
                  <div className="font-bold text-gray-800 text-xs sm:text-sm">{listing.district || listing.region}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Qo'shimcha ma'lumotlar</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {listing.totalFloors ? (
                    <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                      <Layers className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Jami qavat</div>
                      <div className="font-bold text-gray-800">{listing.totalFloors}</div>
                    </div>
                  ) : null}
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <div className="text-lg mb-1">🔥</div>
                    <div className="text-xs text-gray-600">Gaz</div>
                    <div className={`font-bold ${listing.hasGas ? "text-green-600" : "text-red-500"}`}>{listing.hasGas ? "✓ Bor" : "✕ Yo'q"}</div>
                  </div>
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <div className="text-lg mb-1">💧</div>
                    <div className="text-xs text-gray-600">Suv</div>
                    <div className={`font-bold ${listing.hasWater ? "text-green-600" : "text-red-500"}`}>{listing.hasWater ? "✓ Bor" : "✕ Yo'q"}</div>
                  </div>
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                    <div className="text-lg mb-1">💡</div>
                    <div className="text-xs text-gray-600">Elektr</div>
                    <div className={`font-bold ${listing.hasElectricity ? "text-green-600" : "text-red-500"}`}>{listing.hasElectricity ? "✓ Bor" : "✕ Yo'q"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Tavsif</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg rounded-2xl p-5 sm:p-6 lg:sticky lg:top-20">
              <h3 className="font-bold text-gray-800 mb-4">E'lon egasi bilan bog'lanish</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {(listing.user?.name || listing.user?.phone || "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 truncate">{listing.user?.name || "Foydalanuvchi"}</div>
                  <div className="text-xs text-gray-500">E'lon egasi</div>
                </div>
              </div>

              <div className="space-y-3">
                <a href={`tel:+${listing.user?.phone}`} className="block">
                  <Button className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold">
                    <Phone className="h-4 w-4 mr-2" />
                    +{listing.user?.phone}
                  </Button>
                </a>
                <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50" disabled>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Xabar yuborish (tez orada)
                </Button>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Xavfsizlik maslahatlari</h4>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li>• Ko'chmas mulkni shaxsan ko'rib chiqing</li>
                  <li>• Hujjatlarni diqqat bilan tekshiring</li>
                  <li>• Oldindan to'lov qilmang</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
