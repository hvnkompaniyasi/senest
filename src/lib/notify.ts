import { prisma } from "@/lib/auth"

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string,
  link?: string
) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, body: body || null, link: link || null },
    })
  } catch (e) {
    console.error("Notification create failed:", e)
  }
}
