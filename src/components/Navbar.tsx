"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Home, Plus, Heart, User, LogOut } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"

const linkCls = "px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-lg transition-all"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-white/60 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-400/30">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Senest
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className={linkCls}>Bosh sahifa</Link>
            <Link href="/listings?deal=SALE" className={linkCls}>Sotib olish</Link>
            <Link href="/listings?deal=RENT" className={linkCls}>Ijaraga</Link>
            <Link href="/favorites" className={linkCls}>Sevimlilar</Link>
            <Link href="/listings" className={linkCls}>Barcha e'lonlar</Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/add-listing"
              aria-label="E'lon qo'shish"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-400/30 hover:scale-110 transition-transform"
            >
              <Plus className="h-5 w-5 text-white" />
            </Link>
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  aria-label="Profil"
                  className="w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md hover:scale-110 transition-transform"
                >
                  <User className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  aria-label="Chiqish"
                  className="hidden sm:flex w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 items-center justify-center text-red-500 shadow-md hover:scale-110 transition-transform"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-400/30 transition-all"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
