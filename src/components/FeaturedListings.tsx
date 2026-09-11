import Link from "next/link"
import { ArrowRight, Home, Plus } from "lucide-react"
import { prisma } from "@/lib/auth"
import ListingCard from "@/components/ListingCard"
import { DEAL_TYPES } from "@/lib/locations"

export default async function FeaturedListings() {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  const dealLabel = (type: string) =>
    DEAL_TYPES.find((d) => d.id === type)?.name || type

  return (
    <section className="py-12 md:py-16 bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Oxirgi qo'shilgan e'lonlar
            </h2>
            <p className="text-gray-600">Eng yangi va ishonchli takliflar</p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-xl border border-white/70 rounded-xl text-orange-600 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            Barchasini ko'rish
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/70 shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <Home className="h-10 w-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Hozircha e'lonlar yo'q
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Platformada birinchi e'lonni siz qo'shing — u shu yerda va barcha qidiruv sahifalarida ko'rinadi!
            </p>
            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-400/30 transition-all"
            >
              <Plus className="h-5 w-5" />
              E'lon qo'shish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={[listing.region, listing.district].filter(Boolean).join(", ")}
                rooms={listing.rooms || 0}
                area={listing.area || 0}
                image={listing.images?.[0] || ""}
                type={dealLabel(listing.type)}
                createdAt={listing.createdAt.toISOString()}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
