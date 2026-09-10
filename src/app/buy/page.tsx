import { Suspense } from "react"
import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Sotib olish - Senest" }

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
      <ListingsBrowser title="Sotib olish" subtitle="O'zingizga mos uy-joyni toping" dealFilter="Sotuv" />
    </Suspense>
  )
}
