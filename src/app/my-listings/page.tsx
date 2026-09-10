"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Eye, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { DEAL_TYPES } from "@/lib/locations"

interface MyListing {
  id: string
  title: string
  price: number
  status: string
  type: string
  images: string[]
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  ACTIVE: { label: "Faol", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  PENDING: { label: "Moderatsiyada", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  SOLD: { label: "Sotilgan", color: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle },
  REJECTED: { label: "Rad etilgan", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  EXPIRED: { label: "Muddati tugagan", color: "bg-gray-100 text-gray-600 border-gray-200", icon: Clock },
}

export default function MyListingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<MyListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/listings/mine")
        .then((r) => r.json())
        .then((d) => setListings(d.listings || []))
        .catch(() => setListings([]))
        .finally(() => setLoading(false))
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
              Mening e'lonlarim
            </h1>
            <p className="text-sm sm:text-base text-gray-600">{listings.length} ta e'lon</p>
          </div>
          <Link href="/add-listing">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Yangi e'lon
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-xl sm:rounded-2xl p-10 text-center shadow-lg">
            <p className="text-gray-600 mb-4">Hozircha e'lonlaringiz yo'q</p>
            <Link href="/add-listing">
              <Button className="bg-gradient-to-r from-orange-400 to-amber-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Birinchi e'lonni qo'shish
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {listings.map((listing) => {
              const st = statusConfig[listing.status] || statusConfig.PENDING
              const StatusIcon = st.icon
              return (
                <Card key={listing.id} className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="w-full sm:w-24 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <Eye className="h-8 w-8 text-orange-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">{listing.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <span className="font-bold text-orange-600">${listing.price.toLocaleString()}</span>
                        <span>•</span>
                        <span>{DEAL_TYPES.find((d) => d.id === listing.type)?.name || listing.type}</span>
                        <span>•</span>
                        <span>{new Date(listing.createdAt).toLocaleDateString("uz-UZ")}</span>
                      </div>
                      <div className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {st.label}
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      {listing.status === "ACTIVE" && (
                        <Link href={`/listing/${listing.id}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto border-gray-300 text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ko'rish
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
