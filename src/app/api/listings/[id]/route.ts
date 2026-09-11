import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: params.id } })
    if (!listing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })
    return NextResponse.json({ listing })
  } catch (error) {
    console.error("GET /api/listings/[id] error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 })
    }

    const listing = await prisma.listing.findUnique({ where: { id: params.id } })
    if (!listing) return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 })
    if (listing.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
    }

    await prisma.listing.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
