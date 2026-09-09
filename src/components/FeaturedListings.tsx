import ListingCard from "./ListingCard"

const mockListings = [
  {
    id: "1",
    title: "Toshkent sh., Chilonzor tumani, 3-xonali kvartira",
    price: 85000,
    location: "Toshkent, Chilonzor",
    rooms: 3,
    area: 78,
    image: "",
    type: "Sotuv",
  },
  {
    id: "2",
    title: "Samarqand sh., markaziy ko'cha, 2-xonali uy",
    price: 120000,
    location: "Samarqand, Markaz",
    rooms: 2,
    area: 65,
    image: "",
    type: "Sotuv",
  },
  {
    id: "3",
    title: "Buxoro sh., eski shahar, 5-xonali hovli",
    price: 250000,
    location: "Buxoro, Eski shahar",
    rooms: 5,
    area: 180,
    image: "",
    type: "Sotuv",
  },
  {
    id: "4",
    title: "Farg'ona sh., yangi bino, 4-xonali kvartira",
    price: 95000,
    location: "Farg'ona, Yangi bino",
    rooms: 4,
    area: 110,
    image: "",
    type: "Yangi bino",
  },
  {
    id: "5",
    title: "Namangan sh., 2-qavat, 2-xonali kvartira",
    price: 65000,
    location: "Namangan, Markaz",
    rooms: 2,
    area: 55,
    image: "",
    type: "Sotuv",
  },
  {
    id: "6",
    title: "Andijon sh., 3-xonali, ta'mirlangan",
    price: 78000,
    location: "Andijon, Markaz",
    rooms: 3,
    area: 72,
    image: "",
    type: "Sotuv",
  },
]

export default function FeaturedListings() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Oxirgi qo'shilgan e'lonlar
            </h2>
            <p className="text-gray-600">Eng yangi va ishonchli takliflar</p>
          </div>
          <a
            href="/listings"
            className="hidden md:inline-flex px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/70 rounded-xl text-orange-600 font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            Barchasini ko'rish
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a
            href="/listings"
            className="inline-flex px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/70 rounded-xl text-orange-600 font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            Barchasini ko'rish
          </a>
        </div>
      </div>
    </section>
  )
}