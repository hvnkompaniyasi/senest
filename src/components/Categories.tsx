import Link from "next/link"
import { Building2, Home, Briefcase, Trees, Warehouse } from "lucide-react"

const CATS = [
  { id: "APARTMENT", name: "Kvartira", icon: Building2 },
  { id: "HOUSE", name: "Uy / Hovli", icon: Home },
  { id: "OFFICE", name: "Ofis", icon: Briefcase },
  { id: "LAND", name: "Yer", icon: Trees },
  { id: "WAREHOUSE", name: "Ombor", icon: Warehouse },
]

export default function Categories() {
  return (
    <section className="pb-6">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Kategoriyalar</h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {CATS.map((c) => {
          const Icon = c.icon
          return (
            <Link
              key={c.id}
              href={`/listings?category=${c.id}`}
              className="flex-shrink-0 flex items-center gap-2 pl-2 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:border-[#FF9500] transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-[#FF9500]" />
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {c.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
