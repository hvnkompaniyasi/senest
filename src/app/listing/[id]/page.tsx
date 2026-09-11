import { notFound } from "next/navigation"
import { prisma } from "@/lib/auth"
import { MapPin, Bed, Maximize, Layers, Phone, Home as HomeIcon } from "lucide-react"
import ImageGallery from "@/components/ImageGallery"
import ShareButton from "@/components/ShareButton"
import ListingCard from "@/components/ListingCard"
import MessageButton from "@/components/MessageButton"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { DEAL_TYPES, PROPERTY_CATEGORIES } from "@/lib/locations"

export const dynamic = "force-dynamic"

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, phone: true } } },
  })
  if (!listing || listing.status !== "ACTIVE") notFound()

  const deal = DEAL_TYPES.find((d) => d.id === listing.type)?.name || listing.type
  const cat = PROPERTY_CATEGORIES.find((c) => c.id === listing.category)?.name || listing.category
  const phone = listing.user?.phone || ""

  let similar = await prisma.listing.findMany({
    where: { status: "ACTIVE", id: { not: listing.id }, region: listing.region, category: listing.category },
    orderBy: { createdAt: "desc" },
    take: 3,
  })
  if (similar.length < 3) {
    const taken = similar.map((x) => x.id)
    const more = await prisma.listing.findMany({
      where: { status: "ACTIVE", id: { notIn: [...taken, listing.id] }, region: listing.region },
      orderBy: { createdAt: "desc" },
      take: 3 - similar.length,
    })
    similar = [...similar, ...more]
  }

  const facts = [
    { icon: Bed, label: "Xonalar", value: listing.rooms ? String(listing.rooms) : null },
    { icon: Layers, label: "Qavat", value: listing.floor ? `${listing.floor}${listing.totalFloors ? `/${listing.totalFloors}` : ""}` : null },
    { icon: Maximize, label: "Maydon", value: listing.area ? `${listing.area} m²` : null },
    { icon: HomeIcon, label: "Tur", value: cat },
  ].filter((f) => f.value)

  const utilities = [
    { emoji: "🔥", label: "Gaz", ok: !!listing.hasGas },
    { emoji: "💧", label: "Suv", ok: !!listing.hasWater },
    { emoji: "💡", label: "Elektr", ok: !!listing.hasElectricity },
  ]

  const cardCls = "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl shadow-lg"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 pb-28 lg:pb-8">
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-3">
        <ImageGallery images={listing.images} title={listing.title} />

        {/* Sarlavha + narx (ixcham) */}
        <div className={`${cardCls} p-4`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 rounded-full text-[11px] font-bold">{deal}</span>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-bold">{cat}</span>
            </div>
            <ShareButton title={listing.title} iconOnly />
          </div>
          <h1 className="mt-2 text-lg sm:text-xl font-bold text-gray-800 dark:text-white leading-snug">
            {listing.title || "Sarlavhasiz e'lon"}
          </h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
            {[listing.region, listing.district].filter(Boolean).join(", ")}
          </div>
          <div className="mt-2 text-2xl font-bold text-orange-600">
            ${listing.price.toLocaleString("en-US")}
            {listing.type === "RENT" && <span className="text-sm font-medium text-gray-500 dark:text-gray-400"> /oy</span>}
          </div>
        </div>

        {/* Asosiy faktlar - bitta qatorda */}
        {facts.length > 0 && (
          <div className={`${cardCls} p-3 grid grid-cols-2 sm:grid-cols-4 gap-2`}>
            {facts.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="text-center p-2 rounded-xl bg-orange-50 dark:bg-zinc-800">
                  <Icon className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{f.value}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{f.label}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Kommunikatsiyalar - chip'lar */}
        <div className={`${cardCls} p-3 flex flex-wrap gap-2`}>
          {utilities.map((u) => (
            <span
              key={u.label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                u.ok
                  ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-zinc-700 line-through"
              }`}
            >
              <span>{u.emoji}</span> {u.label} {u.ok ? "✓" : "✕"}
            </span>
          ))}
        </div>

        {/* Tavsif - faqat bo'lsa */}
        {listing.description && (
          <div className={`${cardCls} p-4`}>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1.5 text-sm">Tavsif</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        )}

        {/* Egasi bilan bog'lanish */}
        <div className={`${cardCls} p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {(listing.user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 dark:text-white truncate">{listing.user?.name || "E'lon egasi"}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">+{phone}</div>
            </div>
          </div>
          <a
            href={`tel:+${phone}`}
            className="mt-3 h-12 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-green-500/25"
          >
            <Phone className="h-4 w-4" /> Qo'ng'iroq qilish
          </a>
          <MessageButton listingId={listing.id} />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-3 text-base sm:text-lg">O'xshash e'lonlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {similar.map((sim) => (
              <ListingCard
                key={sim.id}
                id={sim.id}
                title={sim.title}
                price={sim.price}
                location={[sim.region, sim.district].filter(Boolean).join(", ")}
                rooms={sim.rooms || 0}
                area={sim.area || 0}
                image={sim.images?.[0] || ""}
                type={DEAL_TYPES.find((d) => d.id === sim.type)?.name || sim.type}
                createdAt={sim.createdAt.toISOString()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobil yopishqoq amal paneli */}
      <div className="fixed bottom-16 left-0 right-0 z-30 lg:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 px-3 py-2 flex gap-2">
        <a href={`tel:+${phone}`} className="flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold text-sm shadow-lg">
          <Phone className="h-4 w-4" /> Qo'ng'iroq qilish
        </a>
        <div className="flex-1">
          <ShareButton title={listing.title} block />
        </div>
      </div>

      <Footer />
    </div>
  )
}
