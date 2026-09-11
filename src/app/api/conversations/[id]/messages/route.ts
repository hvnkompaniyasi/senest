import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { createNotification } from "@/lib/notify"
import { sendPush } from "@/lib/push"
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
    return NextResponse.json(
      { error: validation.error.issues[0]?.message || "Xabar noto'g'ri" },
      { status: 400 }
    )
  }
  const { text } = validation.data

  const message = await prisma.message.create({
    data: {
      conversationId: params.id,
      senderId: uid,
      text: text.trim().slice(0, 1000),
    },
    include: { sender: { select: { id: true, name: true } } },
  })
  await prisma.conversation.update({ where: { id: params.id }, data: { updatedAt: new Date() } })

  // Qabul qiluvchiga: in-app bildirishnoma + push
  const recipientId = conv.buyerId === uid ? conv.sellerId : conv.buyerId
  const senderName = session.user.name || session.user.phone || "Foydalanuvchi"
  const pushBody = `${senderName}: ${message.text.slice(0, 60)}`

  await createNotification(recipientId, "NEW_MESSAGE", "💬 Yangi xabar", pushBody, `/messages?c=${conv.id}`)
  await sendPush(recipientId, { title: "💬 Yangi xabar", body: pushBody, link: `/messages?c=${conv.id}` })

  return NextResponse.json({ message }, { status: 201 })
}
