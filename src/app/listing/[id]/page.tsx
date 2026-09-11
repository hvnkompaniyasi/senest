import { notFound } from "next/navigation"
import Link from "next/link"
import {
  MapPin, Home, Ruler, Layers, Flame, Droplets, Zap, Phone, User, Building2,
} from "lucide-react"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"
import Footer from "@/components/Footer"
import ListingCard from "@/components/ListingCard"
import ListingGallery from "@/components/ListingGallery"
import MessageButton from "@/components/MessageButton"
import ShareListingButton from "@/components/ShareListingButton"
import BackButton from "@/components/BackButton"
import FavoriteToggle from "@/components/FavoriteToggle"
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
  const session = await getServerSession(authOptions)

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, phone: true } } },
  })
  if (!listing || listing.status !== "ACTIVE") notFound()

  const isFavorite = session?.user?.id
    ? !!(await prisma.favorite.findFirst({
        where: { userId: session.user.id, listingId: listing.id },
        select: { id: true },
      }))
    : false

  const similar = await prisma.listing.findMany({
    where: { id: { not: listing.id }, region: listing.region, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 4,
  })

  const dealName = DEAL_TYPES.find((d) => d.id === listing.type)?.name || listing.type

  const specs = [
    listing.rooms ? { icon: Home, value: `${listing.rooms} ta`, label: "Xonalar" } : null,
    listing.area ? { icon: Ruler, value: `${listing.area} m²`, label: "Maydon" } : null,
    listing.floor ? { icon: Layers, value: `${listing.floor}${listing.totalFloors ? `/${listing.totalFloors}` : ""}`, label: "Qavat" } : null,
  ].filter(Boolean) as { icon: typeof Home; value: string; label: string }[]

  const comforts = [
    listing.hasGas ? { icon: Flame, label: "Gaz bor" } : null,
    listing.hasWater ? { icon: Droplets, label: "Suv bor" } : null,
    listing.hasElectricity ? { icon: Zap, label: "Elektr bor" } : null,
  ].filter(Boolean) as { icon: typeof Flame; label: string }[]

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950">
      <Navbar />

      {/* ===== GALEREYA (to'liq kenglik + overlay) ===== */}
      <div className="relative">
        <ListingGallery images={listing.images || []} title={listing.title} />
        <div className="absolute top-3 left-3 z-20">
          <BackButton />
        </div>
        <div className="absolute top-3 right-3 z-20">
          <FavoriteToggle listingId={listing.id} initial={isFavorite} />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 pb-36">
        {/* ===== ASOSIY MA'LUMOTLAR (bitta karta) ===== */}
        <div className="mt-3 bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap gap-2 mb-2.5">
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 rounded-full text-[11px] font-bold">
              {dealName}
            </span>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-full text-[11px] font-bold">
              {categoryNames[listing.category] || listing.category}
            </span>
          </div>

          <div className="text-[26px] leading-tight font-extrabold text-[#FF9500]">
            ${listing.price.toLocaleString("en-US")}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">
            {listing.title || "Sarlavhasiz e'lon"}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            <MapPin className="h-4 w-4 text-[#FF9500] flex-shrink-0" />
            {listing.region}{listing.district ? `, ${listing.district}` : ""}{listing.address ? ` — ${listing.address}` : ""}
          </div>

          {/* Specs grid */}
          {specs.length > 0 && (
            <div className={`grid gap-2.5 mt-4 ${specs.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {specs.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center">
                    <Icon className="h-4 w-4 text-[#FF9500] mx-auto mb-1" />
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">{s.value}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">{s.label}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Kommunikatsiyalar chips */}
          {comforts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {comforts.map((c) => {
                const Icon = c.icon
                return (
                  <span key={c.label} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-[11px] font-semibold">
                    <Icon className="h-3 w-3" /> {c.label}
                  </span>
                )
              })}
            </div>
          )}

          {/* Tavsif */}
          {listing.description && (
            <>
              <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">Tavsif</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Building2 className="h-3.5 w-3.5" />
            E'lon ID: {listing.id.slice(0, 8)} · {new Date(listing.createdAt).toLocaleDateString("uz-UZ")}
          </div>
        </div>

        {/* ===== SOTUVCHI (ixcham) ===== */}
        <div className="mt-3 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF9500] to-[#FF6A00] flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-gray-400 dark:text-gray-500">Sotuvchi</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {listing.user?.name || `+${listing.user?.phone.slice(0, 6)}...`}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <ShareListingButton title={listing.title} />
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 text-center leading-relaxed">
            Firibgarlikdan ehtiyot bo'ling: oldindan to'lov qilmang
          </p>
        </div>

        {/* ===== O'XSHASH E'LONLAR ===== */}
        {similar.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
              {listing.region}dagi boshqa e'lonlar
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
      </main>

      <Footer />
      <div className="h-20" />

      {/* ===== STICKY CTA BAR ===== */}
      <div className="fixed inset-x-0 bottom-16 lg:bottom-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 px-3 py-2.5">
        <div className="max-w-6xl mx-auto flex gap-2.5">
          <a
            href={`tel:+${listing.user?.phone}`}
            className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-green-500/25"
          >
            <Phone className="h-4 w-4" /> Qo'ng'iroq qilish
          </a>
          <div className="flex-1">
            <MessageButton listingId={listing.id} />
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
