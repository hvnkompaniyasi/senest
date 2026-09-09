import ListingsBrowser from "@/components/ListingsBrowser"

export const metadata = { title: "Yangi binolar - Senest" }

export default function NewBuildingsPage() {
  return <ListingsBrowser title="Yangi binolar" subtitle="Zamonaviy yangi qurilishdagi uy-joylar" dealFilter="Yangi bino" />
}