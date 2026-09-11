import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const [listingsCount, activeCount, favoritesCount] = await Promise.all([
    prisma.listing.count({ where: { userId: session.user.id } }),
    prisma.listing.count({ where: { userId: session.user.id, status: "ACTIVE" } }),
    prisma.favorite.count({ where: { userId: session.user.id } }),
  ])

  return NextResponse.json({ listingsCount, activeCount, favoritesCount })
}
