import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const region = searchParams.get("region")
    const district = searchParams.get("district")
    const category = searchParams.get("category")
    const deal = searchParams.get("deal")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const q = searchParams.get("q")
    const sort = searchParams.get("sort") || "new"
    const skip = Math.max(0, Number(searchParams.get("skip")) || 0)
    const take = Math.min(50, Math.max(1, Number(searchParams.get("take")) || 12))

    const where: Record<string, unknown> = { status: "ACTIVE" }
    if (region) where.region = region
    if (district) where.district = district
    if (category) where.category = category
    if (deal) where.type = deal
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      }
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
        { region: { contains: q, mode: "insensitive" } },
      ]
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : [{ isPremium: "desc" as const }, { createdAt: "desc" as const }]

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({ where, orderBy, skip, take, include: { user: { select: { name: true, phone: true } } } }),
      prisma.listing.count({ where }),
    ])

    return NextResponse.json({
      listings,
      total,
      hasMore: skip + listings.length < total,
    })
  } catch (error) {
    console.error("GET /api/listings error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
