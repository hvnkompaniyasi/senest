import Link from "next/link"
import { prisma } from "@/lib/auth"
import { PROPERTY_CATEGORIES } from "@/lib/locations"
import { Building2, Home, Building, TreePine, Warehouse } from "lucide-react"

export const dynamic = "force-dynamic"

const icons: Record<string, any> = { APARTMENT: Building2, HOUSE: Home, OFFICE: Building, LAND: TreePine, WAREHOUSE: Warehouse }
const colors: Record<string, string> = {
  APARTMENT: "from-orange-400 to-amber-500",
  HOUSE: "from-amber-400 to-yellow-500",
  OFFICE: "from-orange-500 to-red-500",
  LAND: "from-green-400 to-emerald-500",
  WAREHOUSE: "from-blue-400 to-cyan-500",
}

export default async function Categories() {
  const groups = await prisma.listing.groupBy({
    by: ["category"],
    where: { status: "ACTIVE" },
    _count: true,
  })
  const countMap: Record<string, number> = {}
  groups.forEach((g) => { countMap[g.category] = g._count })

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">Kategoriyalar bo'yicha qidirish</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">O'zingizga mos turdagi ko'chmas mulkni tanlang</p>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        {PROPERTY_CATEGORIES.map((cat, i) => {
          const Icon = icons[cat.id] || Building2
          const count = countMap[cat.id] || 0
          return (
            <Link
              key={cat.id}
              href={`/listings?category=${cat.id}`}
              className="group bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-2 rounded-xl bg-gradient-to-br ${colors[cat.id]} shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm leading-tight">{cat.name}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {count > 0 ? `${count} ta e'lon` : "Hozircha bo'sh"}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
