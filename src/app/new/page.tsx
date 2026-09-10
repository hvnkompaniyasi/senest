import { Suspense } from "react"
import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Yangi binolar - Senest" }

export default function NewBuildingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
      <ListingsBrowser title="Yangi binolar" subtitle="Zamonaviy yangi qurilishdagi uy-joylar" dealFilter="Yangi bino" />
    </Suspense>
  )
}
