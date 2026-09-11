"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Phone, Mail, Calendar, Home, Heart, Plus, FileText, KeyRound,
  LogOut, Loader2, Pencil, CheckCircle, X, ChevronRight, Star,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string | null; phone: string; email: string | null; createdAt: string } | null>(null)
  const [stats, setStats] = useState({ listingsCount: 0, activeCount: 0, favoritesCount: 0 })
  const [editOpen, setEditOpen] = useState(false)
  const [passOpen, setPassOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [form, setForm] = useState({ name: "", phone: "" })
  const [pass, setPass] = useState({ current: "", next: "", repeat: "" })

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/me").then(r => r.json()).then(d => {
        setUser(d.user)
        setForm({ name: d.user?.name || "", phone: d.user?.phone || "" })
      }).catch(() => {})
      fetch("/api/me/stats").then(r => r.json()).then(d =>
        setStats({ listingsCount: d.listingsCount || 0, activeCount: d.activeCount || 0, favoritesCount: d.favoritesCount || 0 })
      ).catch(() => {})
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }
  if (!session) return null

  const saveProfile = async () => {
    setSaving(true); setErr(""); setMsg("")
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setUser(d.user)
      setMsg("Profil saqlandi!")
      setEditOpen(false)
      setTimeout(() => setMsg(""), 2500)
    } catch (e) { setErr((e as Error).message) }
    finally { setSaving(false) }
  }

  const savePassword = async () => {
    if (pass.next !== pass.repeat) { setErr("Parollar mos kelmaydi"); return }
    setSaving(true); setErr(""); setMsg("")
    try {
      const res = await fetch("/api/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pass.current, newPassword: pass.next }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setMsg("Parol yangilandi!")
      setPassOpen(false)
      setPass({ current: "", next: "", repeat: "" })
      setTimeout(() => setMsg(""), 2500)
    } catch (e) { setErr((e as Error).message) }
    finally { setSaving(false) }
  }

  const statCards = [
    { icon: FileText, label: "E'lonlarim", value: stats.listingsCount, href: "/my-listings", color: "from-orange-400 to-amber-500" },
    { icon: CheckCircle, label: "Faol e'lonlar", value: stats.activeCount, href: "/my-listings", color: "from-green-500 to-emerald-600" },
    { icon: Heart, label: "Sevimlilar", value: stats.favoritesCount, href: "/favorites", color: "from-pink-500 to-rose-500" },
  ]

  const actions = [
    { icon: Plus, label: "Yangi e'lon qo'shish", href: "/add-listing", color: "text-orange-600 bg-orange-100 dark:bg-orange-500/15" },
    { icon: FileText, label: "Mening e'lonlarim", href: "/my-listings", color: "text-blue-600 bg-blue-100 dark:bg-blue-500/15" },
    { icon: Heart, label: "Sevimli e'lonlar", href: "/favorites", color: "text-pink-600 bg-pink-100 dark:bg-pink-500/15" },
    { icon: Star, label: "Barcha e'lonlar", href: "/listings", color: "text-purple-600 bg-purple-100 dark:bg-purple-500/15" },
    { icon: MessageSquare, label: "Xabarlarim", href: "/messages", color: "text-green-600 bg-green-100 dark:bg-green-500/15" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
        {/* Banner + Profil kartasi */}
        <div className="animate-fade-in-up">
          <div className="h-28 sm:h-36 rounded-b-3xl bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />
          <Card className="relative -mt-12 sm:-mt-14 mx-3 sm:mx-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/70 dark:border-zinc-800 shadow-xl rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg shadow-orange-400/40 border-4 border-white dark:border-zinc-900 flex-shrink-0">
                {(user?.name || user?.phone || "U")[0]?.toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                  {user?.name || "Foydalanuvchi"}
                </h1>
                <div className="mt-1.5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="h-3.5 w-3.5 text-orange-500" /> +{user?.phone}
                  </div>
                  {user?.email && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="h-3.5 w-3.5 text-orange-500" /> {user.email}
                    </div>
                  )}
                  {user?.createdAt && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Calendar className="h-3.5 w-3.5 text-orange-500" />
                      Ro'yxatdan o'tgan: {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={() => setEditOpen(true)} variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10">
                <Pencil className="h-4 w-4 mr-1" /> Tahrirlash
              </Button>
            </div>
          </Card>
        </div>

        {msg && <div className="mt-4 mx-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm">{msg}</div>}
        {err && <div className="mt-4 mx-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">{err}</div>}

        {/* Statistika */}
        <div className="grid grid-cols-3 gap-3 mt-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {statCards.map((s, i) => {
            const Icon = s.icon
            return (
              <Link key={i} href={s.href}>
                <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md mb-2`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Tez amallar */}
        <Card className="mt-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="font-bold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">Tez amallar</h2>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((a, i) => {
              const Icon = a.icon
              return (
                <Link key={i} href={a.href} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 hover:bg-orange-50 dark:hover:bg-zinc-800 border border-transparent hover:border-orange-200 dark:hover:border-zinc-700 transition-all">
                  <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">{a.label}</span>
                </Link>
              )
            })}
          </div>
        </Card>

        {/* Sozlamalar */}
        <Card className="mt-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="font-bold text-gray-800 dark:text-white px-5 pt-5 pb-3 text-sm sm:text-base">Sozlamalar</h2>
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors text-left">
              <Pencil className="h-4 w-4 text-orange-500" />
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">Profil ma'lumotlarini tahrirlash</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <button onClick={() => setPassOpen(true)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors text-left">
              <KeyRound className="h-4 w-4 text-orange-500" />
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">Parolni o'zgartirish</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left">
              <LogOut className="h-4 w-4 text-red-500" />
              <span className="flex-1 text-sm font-medium text-red-600 dark:text-red-400">Akkauntdan chiqish</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Profil tahrirlash modali */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Profilni tahrirlash</h3>
              <button onClick={() => setEditOpen(false)} aria-label="Yopish"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-gray-300">Ism</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-gray-300">Telefon</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white" />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Saqlash
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Parol modali */}
      {passOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPassOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Parolni o'zgartirish</h3>
              <button onClick={() => setPassOpen(false)} aria-label="Yopish"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-gray-300">Hozirgi parol</Label>
                <Input type="password" value={pass.current} onChange={(e) => setPass({ ...pass, current: e.target.value })} className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-gray-300">Yangi parol (min 6 belgi)</Label>
                <Input type="password" value={pass.next} onChange={(e) => setPass({ ...pass, next: e.target.value })} className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 dark:text-gray-300">Yangi parol (takror)</Label>
                <Input type="password" value={pass.repeat} onChange={(e) => setPass({ ...pass, repeat: e.target.value })} className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white" />
              </div>
              <Button onClick={savePassword} disabled={saving} className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />}
                Parolni yangilash
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
