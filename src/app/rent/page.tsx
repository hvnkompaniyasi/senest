import { Suspense } from "react"
import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Ijaraga - Senest" }

export default function RentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
      <ListingsBrowser title="Ijaraga" subtitle="Oylik ijara uchun qulay uy-joylar" dealFilter="Ijara" />
    </Suspense>
  )
}
