import { Search, ShieldCheck, Handshake, Headphones } from "lucide-react"

const ITEMS = [
  { icon: Search, title: "Tezkor qidiruv", sub: "14 hudud bo'ylab" },
  { icon: ShieldCheck, title: "Moderatsiya", sub: "Har e'lon tekshirilgan" },
  { icon: Handshake, title: "To'g'ridan-to'g'ri", sub: "Vositasiz bitim" },
  { icon: Headphones, title: "Yordam", sub: "Doimiy qo'llab-quvvatish" },
]

export default function Advantages() {
  return (
    <section className="pb-8">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Nega Senest?</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border border-gray-100 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              <span className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-2">
                <Icon className="h-4 w-4 text-[#FF9500]" />
              </span>
              <div className="text-sm font-bold text-gray-800 dark:text-white">{item.title}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
