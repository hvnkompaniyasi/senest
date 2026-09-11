import { notFound } from "next/navigation"
import Link from "next/link"
import {
  MapPin, Home, Ruler, Building2, Layers, Flame, Droplets, Zap, ArrowLeft, Phone, User
} from "lucide-react"
import { prisma } from "@/lib/auth"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"
import Footer from "@/components/Footer"
import ListingCard from "@/components/ListingCard"
import ListingGallery from "@/components/ListingGallery"
import MessageButton from "@/components/MessageButton"
import ShareListingButton from "@/components/ShareListingButton"
import { DEAL_TYPES } from "@/lib/locations"

export const dynamic = "force-dynamic"

const categoryNames: Record<string, string> = {
  APARTMENT: "Kvartira",
  HOUSE: "Uy / Hovli",
  OFFICE: "Ofis",
  LAND: "Yer uchastkasi",
  WAREHOUSE: "Ombor",
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    select: { title: true, description: true, images: true, price: true },
  })
  if (!listing) return { title: "E'lon topilmadi | Senest" }
  return {
    title: `${listing.title} — $${listing.price.toLocaleString("en-US")} | Senest`,
    description: (listing.description || listing.title).slice(0, 160),
    openGraph: {
      title: listing.title,
      description: (listing.description || "").slice(0, 120),
      images: listing.images?.[0] ? [listing.images[0]] : [],
    },
  }
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, phone: true } } },
  })

  if (!listing || listing.status !== "ACTIVE") notFound()

  const similar = await prisma.listing.findMany({
    where: { id: { not: listing.id }, region: listing.region, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  const dealName = DEAL_TYPES.find((d) => d.id === listing.type)?.name || listing.type

  const facts = [
    listing.rooms ? { icon: Home, label: "Xonalar", value: `${listing.rooms} ta` } : null,
    listing.area ? { icon: Ruler, label: "Maydon", value: `${listing.area} m²` } : null,
    listing.floor ? { icon: Layers, label: "Qavat", value: `${listing.floor}${listing.totalFloors ? ` / ${listing.totalFloors}` : ""}` } : null,
  ].filter(Boolean) as { icon: typeof Home; label: string; value: string }[]

  const comforts = [
    listing.hasGas ? { icon: Flame, label: "Gaz", on: true } : null,
    listing.hasWater ? { icon: Droplets, label: "Suv", on: true } : null,
    listing.hasElectricity ? { icon: Zap, label: "Elektr", on: true } : null,
  ].filter(Boolean) as { icon: typeof Flame; label: string; on: boolean }[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 pb-24 lg:pb-10">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4">
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 hover:text-orange-600">
          <ArrowLeft className="h-4 w-4" /> E'lonlarga qaytish
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          {/* Chap: galereya + ma'lumot */}
          <div>
            <ListingGallery images={listing.images || []} title={listing.title} />

            <div className="mt-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold">
                  {dealName}
                </span>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold">
                  {categoryNames[listing.category] || listing.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                {listing.title || "Sarlavhasiz e'lon"}
              </h1>
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-2">
                ${listing.price.toLocaleString("en-US")}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                {listing.region}{listing.district ? `, ${listing.district}` : ""}{listing.address ? ` — ${listing.address}` : ""}
              </div>

              {facts.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {facts.map((f) => {
                    const Icon = f.icon
                    return (
                      <div key={f.label} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                        <Icon className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                        <div className="text-sm font-bold text-gray-800 dark:text-white">{f.value}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{f.label}</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {comforts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {comforts.map((c) => {
                    const Icon = c.icon
                    return (
                      <span key={c.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                        <Icon className="h-3.5 w-3.5" /> {c.label} bor
                      </span>
                    )
                  })}
                </div>
              )}

              {listing.description && (
                <>
                  <h2 className="font-bold text-gray-800 dark:text-white mt-5 mb-2">Tavsif</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </>
              )}

              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <Building2 className="h-3.5 w-3.5" />
                E'lon ID: {listing.id.slice(0, 8)} · Joylashtirildi: {new Date(listing.createdAt).toLocaleDateString("uz-UZ")}
              </div>
            </div>
          </div>

          {/* O'ng: kontakt karta */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/70 dark:border-zinc-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Sotuvchi</div>
                  <div className="font-bold text-gray-800 dark:text-white">
                    {listing.user?.name || `+${listing.user?.phone.slice(0, 6)}...`}
                  </div>
                </div>
              </div>

              <a
                href={`tel:+${listing.user?.phone}`}
                className="h-12 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-green-500/25"
              >
                <Phone className="h-4 w-4" /> Qo'ng'iroq qilish
              </a>
              <MessageButton listingId={listing.id} />
              <div className="mt-2">
                <ShareListingButton title={listing.title} />
              </div>

              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 text-center leading-relaxed">
                Firibgarlikdan ehtiyot bo'ling: oldindan to'lov qilmang va shaxsiy ma'lumotlaringizni ulashmang
              </p>
            </div>
          </div>
        </div>

        {/* O'xshash e'lonlar */}
        {similar.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              {listing.region}dagi boshqa e'lonlar
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {similar.map((s) => (
                <ListingCard
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  price={s.price}
                  location={[s.region, s.district].filter(Boolean).join(", ")}
                  rooms={s.rooms || 0}
                  area={s.area || 0}
                  image={s.images?.[0] || ""}
                  type={DEAL_TYPES.find((d) => d.id === s.type)?.name || s.type}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  )
}
