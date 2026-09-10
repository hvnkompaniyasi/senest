import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { Prisma } from "@prisma/client"

const EDITABLE = ["title","description","price","region","district","address","rooms","area","floor","totalFloors","category","type","hasGas","hasWater","hasElectricity","images"]

function norm(field: string, v: unknown): unknown {
  if (field === "images") return Array.isArray(v) ? v : []
  if (["hasGas","hasWater","hasElectricity"].includes(field)) return !!v
  if (["price","area","rooms","floor","totalFloors"].includes(field)) {
    if (v === null || v === undefined || v === "") return null
    return Number(v)
  }
  if (v === null || v === undefined) return ""
  return String(v)
}

async function getOwnerListing(id: string, userId: string) {
  return prisma.listing.findFirst({ where: { id, userId } })
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })
  const listing = await getOwnerListing(params.id, session.user.id)
  if (!listing) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })
  return NextResponse.json({ listing })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Auth kerak" }, { status: 401 })

  const current = await getOwnerListing(params.id, session.user.id)
  if (!current) return NextResponse.json({ error: "Topilmadi" }, { status: 404 })

  const body = await req.json()
  const changes: Record<string, { old: unknown; new: unknown }> = {}

  for (const field of EDITABLE) {
    if (!(field in body)) continue
    const oldV = norm(field, (current as Record<string, unknown>)[field])
    const newV = norm(field, body[field])
    if (JSON.stringify(oldV) !== JSON.stringify(newV)) {
      changes[field] = { old: oldV, new: newV }
    }
  }

  if (Object.keys(changes).length === 0) {
    return NextResponse.json({ error: "Hech qanday o'zgarish yo'q" }, { status: 400 })
  }

  // Eski kutilayotgan so'rovni o'chirib, yangisini qo'yamiz
  await prisma.listingEdit.deleteMany({ where: { listingId: params.id, status: "PENDING" } })
  await prisma.listingEdit.create({
    data: {
      listingId: params.id,
      userId: session.user.id,
      changes: changes as Prisma.InputJsonValue,
      status: "PENDING",
    },
  })

  return NextResponse.json({ ok: true, count: Object.keys(changes).length })
}
