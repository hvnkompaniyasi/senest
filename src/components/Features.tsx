import { Zap, Shield, BadgeCheck, Headphones } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Tezkor qidiruv",
    description: "Bir necha soniyada o'zingizga mos uy-joy toping",
    color: "from-orange-400 to-amber-500",
  },
  {
    icon: Shield,
    title: "Xavfsiz to'lov",
    description: "Barcha bitimlar himoyalangan va kafolatlangan",
    color: "from-amber-400 to-yellow-500",
  },
  {
    icon: BadgeCheck,
    title: "Tekshirilgan e'lonlar",
    description: "Har bir e'lon moderatsiyadan o'tadi",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Headphones,
    title: "24/7 qo'llab-quvvatlash",
    description: "Istalgan vaqtda biz bilan bog'laning",
    color: "from-blue-400 to-cyan-500",
  },
]

export default function Features() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Nima uchun Senest?
          </h2>
          <p className="text-gray-600">Bizning afzalliklarimiz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group bg-white/70 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-orange-400/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}