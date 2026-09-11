import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        select: {
          id: true, title: true, price: true, region: true, district: true,
          rooms: true, area: true, images: true, type: true, category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ favorites })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  }

  const { listingId } = await req.json()
  if (!listingId) {
    return NextResponse.json({ error: "listingId kerak" }, { status: 400 })
  }

  try {
    const favorite = await prisma.favorite.create({
      data: { userId: session.user.id, listingId },
    })
    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Allaqachon sevimlilar ro'yxatida" }, { status: 409 })
    }
    throw error
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const listingId = searchParams.get("listingId")
  if (!listingId) {
    return NextResponse.json({ error: "listingId kerak" }, { status: 400 })
  }

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, listingId },
  })

  return NextResponse.json({ success: true })
}
