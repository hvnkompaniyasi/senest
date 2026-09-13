import Link from "next/link"
import { ArrowRight, Home, Crown } from "lucide-react"
import { prisma } from "@/lib/auth"
import ListingCard from "@/components/ListingCard"
import { DEAL_TYPES } from "@/lib/locations"

export const dynamic = "force-dynamic"

export default async function FeaturedListings() {
  const premium = await prisma.listing.findMany({
    where: { status: "ACTIVE", isPremium: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { user: { select: { name: true } } },
  })

  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { user: { select: { name: true } } },
  })

  return (
    <section className="pb-6">
      {premium.length > 0 && (
        <section className="pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-4 w-4 text-amber-500" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">VIP e'lonlar</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 snap-x pb-1">
            {premium.map((l) => (
              <div key={l.id} className="w-52 flex-shrink-0 snap-start">
                <ListingCard
                  id={l.id}
                  title={l.title}
                  price={l.price}
                  location={[l.region, l.district].filter(Boolean).join(", ")}
                  rooms={l.rooms || 0}
                  area={l.area || 0}
                  image={l.images?.[0] || ""}
                  type={DEAL_TYPES.find((d) => d.id === l.type)?.name || l.type}
                  seller={l.user?.name || undefined}
                  isPremium
                  createdAt={l.createdAt.toISOString()}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Oxirgi qo'shilgan e'lonlar</h2>
        <Link href="/listings" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9500]">
          Barchasi <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <Home className="h-10 w-10 text-gray-300 dark:text-zinc-700 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Hali e'lonlar yo'q</p>
          <Link href="/add-listing" className="text-xs font-bold text-[#FF9500]">
            Birinchi bo'lib joylang →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map((l) => (
            <ListingCard
              key={l.id}
              id={l.id}
              title={l.title}
              price={l.price}
              location={[l.region, l.district].filter(Boolean).join(", ")}
              rooms={l.rooms || 0}
              area={l.area || 0}
              image={l.images?.[0] || ""}
              type={DEAL_TYPES.find((d) => d.id === l.type)?.name || l.type}
              seller={l.user?.name || undefined}
              createdAt={l.createdAt.toISOString()}
            />
          ))}
        </div>
      )}
    </section>
  )
}
