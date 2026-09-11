import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Categories from "@/components/Categories"
import FeaturedListings from "@/components/FeaturedListings"
import Footer from "@/components/Footer"
import { Search, ShieldCheck, Phone, Headphones } from "lucide-react"

export const dynamic = "force-dynamic"

const features = [
  { icon: Search, color: "from-orange-400 to-amber-500", title: "Tezkor qidiruv", text: "14 hudud bo'yicha minglab e'lonlar orasidan o'zingizga mosini toping" },
  { icon: ShieldCheck, color: "from-green-400 to-emerald-500", title: "Moderatsiyadan o'tgan e'lonlar", text: "Har bir e'lon admin ko'rigidan so'ng saytda ko'rinadi" },
  { icon: Phone, color: "from-blue-400 to-cyan-500", title: "To'g'ridan-to'g'ri bitim", text: "To'lov va kelishuvlar tomonlar o'rtasida bevosita amalga oshiriladi" },
  { icon: Headphones, color: "from-purple-400 to-pink-500", title: "Aloqa va yordam", text: "Savollaringiz bo'lsa, bizga qo'ng'iroq qiling yoki yozing" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedListings />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-5 shadow-lg animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
