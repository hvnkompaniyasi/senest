"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Home, Search, Plus, MapPin, User } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const items = [
    { href: "/", icon: Home, label: "Bosh sahifa" },
    { href: "/listings", icon: Search, label: "Qidiruv" },
    { href: "/add-listing", icon: Plus, label: "Qo'shish", center: true },
    { href: "/map", icon: MapPin, label: "Xarita" },
    { href: session ? "/profile" : "/login", icon: User, label: "Profil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-5 items-end h-16">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          if (item.center) {
            return (
              <Link key={item.href} href={item.href} className="flex justify-center -mt-6" aria-label={item.label}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-400/40 border-4 border-white active:scale-95 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
                isActive ? "text-orange-600" : "text-gray-500"
              }`}
              aria-label={item.label}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-orange-100" : ""}`} />
              <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
