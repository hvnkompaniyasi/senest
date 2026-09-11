import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/auth"
import { createNotification } from "@/lib/notify"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }

  // 25-30 kun orasidagi ACTIVE e'lonlar
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const to = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)

  const soon = await prisma.listing.findMany({
    where: { status: "ACTIVE", createdAt: { gte: from, lte: to } },
    select: { id: true, userId: true, title: true },
  })

  for (const l of soon) {
    await createNotification(
      l.userId,
      "LISTING_EXPIRING",
      "⏰ E'lon muddati tugayapti",
      `"${(l.title || "E'lon").slice(0, 40)}" 5 kun ichida tugaydi`,
      "/my-listings"
    )
  }

  return NextResponse.json({ ok: true, notified: soon.length })
}
