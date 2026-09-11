import Link from "next/link"
import { prisma } from "@/lib/auth"
import { DEAL_TYPES } from "@/lib/locations"
import ListingCard from "@/components/ListingCard"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function FeaturedListings() {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  if (listings.length === 0) return null

  const dealLabel = (t: string) => DEAL_TYPES.find((d) => d.id === t)?.name || t

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Oxirgi qo'shilgan e'lonlar</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Eng yangi takliflar bilan tanishing</p>
        </div>
        <Link href="/listings" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline">
          Barchasini ko'rish <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            type={dealLabel(l.type)}
            createdAt={l.createdAt.toISOString()}
          />
        ))}
      </div>
      <div className="mt-6 text-center sm:hidden">
        <Link href="/listings" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:underline">
          Barchasini ko'rish <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
