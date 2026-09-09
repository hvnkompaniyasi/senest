import { Suspense } from "react"
import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Barcha e'lonlar - Senest" }

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
      <ListingsBrowser title="Barcha e'lonlar" subtitle="Platformadagi barcha faol e'lonlar" />
    </Suspense>
  )
}