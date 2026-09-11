import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { ChangePasswordSchema } from "@/lib/schemas"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || !user.password) {
      return NextResponse.json({ error: "Parol o'rnatilmagan (telefon orqali kirgan bo'lsangiz, admin bilan bog'laning)" }, { status: 400 })
    }

    const body = await req.json()
    const validation = ChangePasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Ma'lumotlar noto'g'ri" },
        { status: 400 }
      )
    }
    const { currentPassword, newPassword } = validation.data

    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) {
      return NextResponse.json({ error: "Hozirgi parol noto'g'ri" }, { status: 403 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("POST /api/me/password error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
