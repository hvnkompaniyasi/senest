import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import { createNotification } from "@/lib/notify"
import { EditListingSchema } from "@/lib/schemas"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 })
    }
    const uid = session.user.id

    const listing = await prisma.listing.findUnique({ where: { id: params.id } })
    if (!listing) return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 })
    if (listing.userId !== uid) {
      return NextResponse.json({ error: "Faqat e'lon egasi tahrirlashi mumkin" }, { status: 403 })
    }

    // Allaqachon ko'rib chiqilayotgan so'rov bormi?
    const pending = await prisma.listingEdit.findFirst({
      where: { listingId: params.id, status: "PENDING" },
    })
    if (pending) {
      return NextResponse.json(
        { error: "Oldingi o'zgarish so'rovi hali ko'rib chiqilmoqda" },
        { status: 409 }
      )
    }

    const body = await req.json()
    const validation = EditListingSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Ma'lumotlar noto'g'ri" },
        { status: 400 }
      )
    }
    const data = validation.data

    await prisma.listingEdit.create({
      data: {
        listingId: params.id,
        userId: uid,
        changes: data as object,
        status: "PENDING",
      },
    })

    await createNotification(
      uid,
      "EDIT_SUBMITTED",
      "📝 O'zgarish so'rovi qabul qilindi",
      "E'loningizdagi o'zgarishlar moderator ko'rigidan so'ng qo'llaniladi",
      "/my-listings"
    )

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("POST edit-request error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
