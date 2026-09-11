import { MetadataRoute } from "next"
import { prisma } from "@/lib/auth"

const BASE = "https://senest-nine.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, updatedAt: true },
    take: 5000,
  })

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/listings`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/map`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/add-listing`, changeFrequency: "monthly", priority: 0.5 },
  ]

  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${BASE}/listing/${l.id}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticPages, ...listingPages]
}
