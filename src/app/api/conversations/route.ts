import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  const uid = session.user.id

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: uid }, { sellerId: uid }] },
    include: {
      listing: { select: { id: true, title: true, images: true, price: true } },
      buyer: { select: { id: true, name: true, phone: true } },
      seller: { select: { id: true, name: true, phone: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { id: true } } } },
      _count: { select: { messages: { where: { read: false, NOT: { senderId: uid } } } } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const unreadTotal = conversations.reduce((sum, c) => sum + c._count.messages, 0)
  return NextResponse.json({ conversations, unreadTotal })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  const uid = session.user.id

  const { listingId } = await req.json()
  if (!listingId) return NextResponse.json({ error: "listingId kerak" }, { status: 400 })

  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 })
  if (listing.userId === uid) {
    return NextResponse.json({ error: "O'z e'loningizga xabar yozib bo'lmaydi" }, { status: 400 })
  }

  const conversation = await prisma.conversation.upsert({
    where: { listingId_buyerId: { listingId, buyerId: uid } },
    update: {},
    create: { listingId, buyerId: uid, sellerId: listing.userId },
    include: {
      listing: { select: { id: true, title: true, images: true, price: true } },
      buyer: { select: { id: true, name: true, phone: true } },
      seller: { select: { id: true, name: true, phone: true } },
    },
  })

  return NextResponse.json({ conversation }, { status: 201 })
}
