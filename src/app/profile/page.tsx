"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Phone, Mail, Home, Heart, Settings, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({ listingsCount: 0, favoritesCount: 0 })

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/me/stats")
        .then((r) => r.json())
        .then((d) => setStats({ listingsCount: d.listingsCount || 0, favoritesCount: d.favoritesCount || 0 }))
        .catch(() => {})
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session) return null

  const statCards = [
    { icon: Home, label: "Mening e'lonlarim", value: stats.listingsCount, href: "/my-listings" },
    { icon: Heart, label: "Sevimlilar", value: stats.favoritesCount, href: "/listings" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg shadow-orange-400/30 flex-shrink-0">
              {(session.user?.name || session.user?.phone || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 truncate">
                {session.user?.name || "Foydalanuvchi"}
              </h1>
              <div className="space-y-1 text-sm text-gray-600">
                {session.user?.phone && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="h-4 w-4 text-orange-500" />
                    +{session.user.phone}
                  </div>
                )}
                {session.user?.email && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4 text-orange-500" />
                    {session.user.email}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Link key={i} href={stat.href}>
                <Card className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <Card className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            Sozlamalar
          </h2>
          <div className="space-y-2">
            <Link href="/my-listings" className="block px-4 py-3 bg-white/80 border border-white/70 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700">
              Mening e'lonlarimni boshqarish
            </Link>
            <Link href="/add-listing" className="block px-4 py-3 bg-white/80 border border-white/70 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700">
              Yangi e'lon qo'shish
            </Link>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
