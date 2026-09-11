import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, phone: true, email: true, createdAt: true },
  })
  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const { name, phone } = await req.json()
  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name ? String(name) : null
  if (phone !== undefined) data.phone = String(phone)

  try {
    const user = await prisma.user.update({ where: { id: session.user.id }, data })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "Bu telefon allaqachon band" }, { status: 400 })
  }
}
