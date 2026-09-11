import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const rateMap = new Map<string, { count: number; reset: number }>()

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const now = Date.now()
    const rec = rateMap.get(ip)

    if (!rec || now > rec.reset) {
      rateMap.set(ip, { count: 1, reset: now + 60_000 })
    } else {
      rec.count++
      if (rec.count > 120) {
        return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 })
      }
    }
    if (rateMap.size > 10_000) rateMap.clear()
  }
  return NextResponse.next()
}

export const config = { matcher: "/api/:path*" }
