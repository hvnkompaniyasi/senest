import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { CreateListingSchema } from "@/lib/schemas"

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

    const where: any = { status: "ACTIVE" }
    if (region) where.region = region
    if (district) where.district = district
    if (category) where.category = category
    if (deal) where.type = deal
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ]
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("GET /api/listings error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 })
    }

    const body = await req.json()

    // Zod validation
    const validation = CreateListingSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || "Ma'lumotlar noto'g'ri" },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    const listing = await prisma.listing.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        description: validatedData.description || "",
        type: validatedData.type as any,
        category: validatedData.category as any,
        price: validatedData.price,
        currency: validatedData.currency,
        region: validatedData.region,
        district: validatedData.district || "",
        address: validatedData.address || "",
        latitude: validatedData.latitude ?? null,
        longitude: validatedData.longitude ?? null,
        rooms: validatedData.rooms ?? null,
        area: validatedData.area ?? null,
        floor: validatedData.floor ?? null,
        totalFloors: validatedData.totalFloors ?? null,
        hasGas: validatedData.hasGas ?? false,
        hasWater: validatedData.hasWater ?? false,
        hasElectricity: validatedData.hasElectricity ?? false,
        images: validatedData.images,
      },
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error("POST /api/listings error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
