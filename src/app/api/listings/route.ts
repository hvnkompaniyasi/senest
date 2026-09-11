import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const region = searchParams.get("region")
    const district = searchParams.get("district")
    const category = searchParams.get("category")
    const deal = searchParams.get("deal")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rooms = searchParams.get("rooms")
    const minArea = searchParams.get("minArea")
    const maxArea = searchParams.get("maxArea")
    const q = searchParams.get("q")
    const sortBy = searchParams.get("sortBy") || "newest"

    const where: any = { status: "ACTIVE" }

    if (region) where.region = region
    if (district) where.district = district
    if (category) where.category = category
    if (deal) where.type = deal
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (rooms) {
      where.rooms = rooms === "5" ? { gte: 5 } : parseInt(rooms)
    }
    if (minArea || maxArea) {
      where.area = {}
      if (minArea) where.area.gte = parseFloat(minArea)
      if (maxArea) where.area.lte = parseFloat(maxArea)
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
        { region: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
      ]
    }

    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "price-asc") orderBy = { price: "asc" }
    if (sortBy === "price-desc") orderBy = { price: "desc" }
    if (sortBy === "area-desc") orderBy = { area: "desc" }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: { user: { select: { name: true, phone: true } } },
      take: 100,
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Listings GET error:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth-options")
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 })
    }

    const body = await req.json()
    const {
      title, description, type, category, region, district, address,
      price, currency, rooms, area, floor, totalFloors,
      hasGas, hasWater, hasElectricity, images,
    } = body

    const isBuilding = ["APARTMENT", "HOUSE", "OFFICE"].includes(category)

    if (!category || !type || !region || !price) {
      return NextResponse.json({ error: "Kategoriya, bitim turi, region va narx majburiy" }, { status: 400 })
    }
    if (isBuilding && (!rooms || !floor || !totalFloors)) {
      return NextResponse.json({ error: "Xonalar soni, qavat va jami qavatlar majburiy" }, { status: 400 })
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Kamida bitta rasm yuklang" }, { status: 400 })
    }

    const listing = await prisma.listing.create({
      data: {
        title: title || "",
        description: description || "",
        type,
        category,
        status: "PENDING",
        price: parseFloat(price),
        currency: currency || "USD",
        region,
        district: district || "",
        address: address || "",
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        rooms: rooms ? parseInt(rooms) : null,
        area: area ? parseFloat(area) : null,
        floor: floor ? parseInt(floor) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        hasGas: !!hasGas,
        hasWater: !!hasWater,
        hasElectricity: !!hasElectricity,
        images,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error("Listing create error:", error)
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 })
  }
}
