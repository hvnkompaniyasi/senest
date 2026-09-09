"use client"

import Link from "next/link"
import { Home, Plus, Menu, User, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAddListing = () => {
    if (!session) {
      window.location.href = "/login?callbackUrl=/add-listing"
    } else {
      window.location.href = "/add-listing"
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/30 group-hover:scale-110 transition-transform">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              Senest
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/buy" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Sotib olish
            </Link>
            <Link href="/rent" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Ijaraga
            </Link>
            <Link href="/new" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Yangi binolar
            </Link>
            <Link href="/listings" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Barcha e'lonlar
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <button
              onClick={handleAddListing}
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold px-3 xl:px-4 py-2 rounded-xl shadow-lg shadow-orange-400/30 hover:shadow-orange-400/50 transition-all flex items-center gap-1.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xl:inline">E'lon qo'shish</span>
              <span className="xl:hidden">Qo'shish</span>
            </button>

            {session ? (
              <div className="flex items-center gap-2 pl-2 xl:pl-3 border-l border-gray-200">
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-500 hover:text-red-500 h-8 w-8"
                  title="Chiqish"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 h-9 px-3 text-sm">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden xl:inline">Kirish</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handleAddListing}
              className="bg-gradient-to-r from-orange-400 to-amber-500 text-white p-2 rounded-lg shadow-md"
              title="E'lon qo'shish"
            >
              <Plus className="h-4 w-4" />
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 space-y-1 animate-in slide-in-from-top-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
              Bosh sahifa
            </Link>
            <Link href="/buy" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
              Sotib olish
            </Link>
            <Link href="/rent" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
              Ijaraga
            </Link>
            <Link href="/new" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
              Yangi binolar
            </Link>
            <Link href="/listings" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
              Barcha e'lonlar
            </Link>
            
            <div className="pt-2 mt-2 border-t border-gray-100">
              {session ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
                    Mening profilim
                  </Link>
                  <Link href="/my-listings" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">
                    Mening e'lonlarim
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 mt-2"
                    onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Chiqish
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg">
                  <User className="h-4 w-4 inline mr-2" />
                  Kirish
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}