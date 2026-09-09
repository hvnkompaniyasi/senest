"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Bed, Maximize, Home, Phone, MessageCircle, Heart, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ListingDetailPage() {
  const params = useParams()
  const id = params.id

  // Mock data (keyinchalik API'dan olinadi)
  const listing = {
    id: id,
    title: "3-xonali kvartira, Chilonzor tumani",
    price: 85000,
    currency: "USD",
    location: "Toshkent sh., Chilonzor tumani",
    address: "Bunyodkor ko'chasi, 15-uy",
    rooms: 3,
    area: 78,
    floor: 5,
    totalFloors: 9,
    type: "Kvartira",
    condition: "Yaxshi",
    description: "Chilonzor tumanida joylashgan 3-xonali kvartira sotiladi. Kvartira yaxshi ta'mirlangan, barcha kommunikatsiyalar mavjud. Yaqin atrofda maktab, bog'cha, supermarket va transport bekatlari joylashgan.",
    features: ["Mebel bilan", "Balkon", "Lift", "Parking"],
    images: [],
    seller: {
      name: "Sardor",
      phone: "+998 90 123 45 67",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/listings" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Barcha e'lonlarga qaytish
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <Home className="h-24 w-24 text-orange-400" />
              </div>
            </Card>

            {/* Info */}
            <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>{listing.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                ${listing.price.toLocaleString()}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Bed className="h-5 w-5 text-orange-500 mb-2" />
                  <div className="text-sm text-gray-600">Xonalar</div>
                  <div className="font-bold text-gray-800">{listing.rooms}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Maximize className="h-5 w-5 text-orange-500 mb-2" />
                  <div className="text-sm text-gray-600">Maydon</div>
                  <div className="font-bold text-gray-800">{listing.area} m²</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Home className="h-5 w-5 text-orange-500 mb-2" />
                  <div className="text-sm text-gray-600">Qavat</div>
                  <div className="font-bold text-gray-800">{listing.floor}/{listing.totalFloors}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="h-5 w-5 text-orange-500 mb-2 font-bold">✓</div>
                  <div className="text-sm text-gray-600">Holat</div>
                  <div className="font-bold text-gray-800">{listing.condition}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Tavsif</h3>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Qo'shimchalar</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-sm font-medium text-orange-700">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg rounded-2xl p-6 sticky top-20">
              <h3 className="font-bold text-gray-800 mb-4">Sotuvchi bilan bog'lanish</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                  {listing.seller.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{listing.seller.name}</div>
                  <div className="text-sm text-gray-500">E'lon egasi</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold">
                  <Phone className="h-4 w-4 mr-2" />
                  {listing.seller.phone}
                </Button>
                
                <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Xabar yuborish
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Xavfsizlik maslahatlari</h4>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li>• Shaxsiy uchrashuvda tekshiring</li>
                  <li>• Hujjatlarni tekshiring</li>
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