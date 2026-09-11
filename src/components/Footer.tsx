import Link from "next/link"
import { Home, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 flex items-center justify-center">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">Senest</span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400">
              O'zbekistonning eng zamonaviy ko'chmas mulk platformasi
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Bo'limlar</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/listings?deal=SALE" className="hover:text-orange-400 transition-colors">Sotib olish</Link></li>
              <li><Link href="/listings?deal=RENT" className="hover:text-orange-400 transition-colors">Ijaraga</Link></li>
              <li><Link href="/listings" className="hover:text-orange-400 transition-colors">Barcha e'lonlar</Link></li>
              <li><Link href="/add-listing" className="hover:text-orange-400 transition-colors">E'lon qo'shish</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Kompaniya</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-orange-400 transition-colors">Biz haqimizda</Link></li>
              <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Aloqa</Link></li>
              <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Shartlar</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Maxfiylik</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Aloqa</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                +998 33 007 01 50
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                frlking2007@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 mt-0.5" />
                Toshkent sh., Amir Temur ko'chasi
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">
          © 2026 Senest. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  )
}
