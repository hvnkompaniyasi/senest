import Link from "next/link"
import { Building2, Home, Building, TreePine, Warehouse, Key } from "lucide-react"

const categories = [
  { id: "apartment", name: "Kvartira", icon: Building2, color: "from-orange-400 to-amber-500", count: 3240 },
  { id: "house", name: "Uy-joy", icon: Home, color: "from-amber-400 to-yellow-500", count: 1850 },
  { id: "office", name: "Ofis", icon: Building, color: "from-orange-500 to-red-500", count: 620 },
  { id: "land", name: "Yer maydoni", icon: TreePine, color: "from-green-400 to-emerald-500", count: 980 },
  { id: "warehouse", name: "Ombor", icon: Warehouse, color: "from-blue-400 to-cyan-500", count: 340 },
  { id: "rent", name: "Ijara", icon: Key, color: "from-purple-400 to-pink-500", count: 2100 },
]

export default function Categories() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Kategoriyalar bo'yicha qidirish
          </h2>
          <p className="text-gray-600">O'zingizga mos turdagi ko'chmas mulkni tanlang</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group relative bg-white/70 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-orange-400/20 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 mb-3 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="font-semibold text-gray-800 mb-1">{cat.name}</div>
                <div className="text-xs text-gray-500">{cat.count.toLocaleString()} e'lon</div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}