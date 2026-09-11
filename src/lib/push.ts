import webpush from "web-push"
import { prisma } from "@/lib/auth"

interface PushPayload {
  title: string
  body?: string
  link?: string
}

interface PushError {
  statusCode?: number
}

const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const vapidPrivate = process.env.VAPID_PRIVATE_KEY || ""

let configured = false

function ensureConfig(): boolean {
  if (configured) return true
  if (!vapidPublic || !vapidPrivate) return false
  webpush.setVapidDetails("mailto:frlking2007@gmail.com", vapidPublic, vapidPrivate)
  configured = true
  return true
}

export async function sendPush(userId: string, payload: PushPayload): Promise<void> {
  if (!ensureConfig()) return

  const subs = await prisma.pushSubscription.findMany({ where: { userId } })
  if (subs.length === 0) return

  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        )
        .catch(async (err: unknown) => {
          const status = (err as PushError).statusCode
          // Obuna eskirgan bo'lsa o'chiramiz
          if (status === 404 || status === 410) {
            await prisma.pushSubscription
              .deleteMany({ where: { endpoint: sub.endpoint } })
              .catch(() => {})
          }
        })
    )
  )
}
