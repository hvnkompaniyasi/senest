import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export const dynamic = "force-dynamic"

const PushSubSchema = z.object({
  endpoint: z.string().min(10),
  keys: z.object({
    p256dh: z.string().min(10),
    auth: z.string().min(10),
  }),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const body = await req.json()
  const validation = PushSubSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0]?.message || "Noto'g'ri ma'lumot" },
      { status: 400 }
    )
  }
  const data = validation.data

  await prisma.pushSubscription.upsert({
    where: { endpoint: data.endpoint },
    update: { userId: session.user.id, p256dh: data.keys.p256dh, auth: data.keys.auth },
    create: {
      userId: session.user.id,
      endpoint: data.endpoint,
      p256dh: data.keys.p256dh,
      auth: data.keys.auth,
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const body = await req.json()
  const endpoint = typeof body.endpoint === "string" ? body.endpoint : ""
  if (!endpoint) return NextResponse.json({ error: "endpoint kerak" }, { status: 400 })

  await prisma.pushSubscription.deleteMany({
    where: { endpoint, userId: session.user.id },
  })

  return NextResponse.json({ ok: true })
}
