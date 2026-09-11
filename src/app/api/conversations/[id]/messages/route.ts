import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { CreateMessageSchema } from "@/lib/schemas"

export const dynamic = "force-dynamic"

async function getConv(id: string, uid: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true, images: true, price: true } },
      buyer: { select: { id: true, name: true, phone: true } },
      seller: { select: { id: true, name: true, phone: true } },
    },
  })
  if (!conv) return null
  if (conv.buyerId !== uid && conv.sellerId !== uid) return null
  return conv
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  const uid = session.user.id

  const conv = await getConv(params.id, uid)
  if (!conv) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })

  const messages = await prisma.message.findMany({
    where: { conversationId: params.id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true } } },
  })

  // Menga kelgan xabarlarni o'qilgan deb belgilash
  await prisma.message.updateMany({
    where: { conversationId: params.id, NOT: { senderId: uid }, read: false },
    data: { read: true },
  })

  return NextResponse.json({ conversation: conv, messages })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  const uid = session.user.id

  const conv = await getConv(params.id, uid)
  if (!conv) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })

    const body = await req.json()
  const validation = CreateMessageSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.issues[0]?.message || "Validation xatosi" }, { status: 400 })
  }
  const { text } = validation.data

  if (!text || !String(text).trim()) return NextResponse.json({ error: "Xabar bo'sh" }, { status: 400 })

  const message = await prisma.message.create({
    data: { conversationId: params.id, senderId: uid, text: String(text).trim().slice(0, 1000) },
    include: { sender: { select: { id: true, name: true } } },
  })
  await prisma.conversation.update({ where: { id: params.id }, data: { updatedAt: new Date() } })

  return NextResponse.json({ message }, { status: 201 })
}
