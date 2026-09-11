import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/profile", "/my-listings", "/favorites"] },
    ],
    sitemap: "https://senest-nine.vercel.app/sitemap.xml",
  }
}
