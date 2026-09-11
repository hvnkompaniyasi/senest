import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/auth"
import { ListingStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] })

  const cond = { contains: q, mode: "insensitive" as const }

  const [listings, regions] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        OR: [{ title: cond }, { district: cond }, { address: cond }],
      },
      select: { id: true, title: true, region: true, price: true },
      take: 5,
    }),
    prisma.listing.findMany({
      where: { status: ListingStatus.ACTIVE, region: cond },
      select: { region: true },
      distinct: ["region"],
      take: 3,
    }),
  ])

  const suggestions = [
    ...regions.map((r) => ({
      type: "region",
      label: r.region,
      href: `/listings?region=${encodeURIComponent(r.region)}`,
    })),
    ...listings.map((l) => ({
      type: "listing",
      label: l.title || "Sarlavhasiz e'lon",
      href: `/listing/${l.id}`,
      meta: `${l.region} • $${l.price.toLocaleString("en-US")}`,
    })),
  ]

  return NextResponse.json({ suggestions })
}
