import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Yangi parol kamida 6 belgi" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || !user.password) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword || "", user.password)
  if (!valid) return NextResponse.json({ error: "Hozirgi parol noto'g'ri" }, { status: 403 })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
  return NextResponse.json({ ok: true })
}
