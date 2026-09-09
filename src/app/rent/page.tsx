import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Ijaraga - Senest" }

export default function RentPage() {
  return <ListingsBrowser title="Ijaraga" subtitle="Oylik ijara uchun qulay uy-joylar" dealFilter="Ijara" />
}