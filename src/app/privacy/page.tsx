import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Maxfiylik siyosati - Senest",
}

export default function StaticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-10">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Maxfiylik siyosati
          </h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
            <p>Biz foydalanuvchilarimiz shaxsiy ma'lumotlarini himoya qilishga sodiqmiz.</p>
<p><strong>Qanday ma'lumotlarni yig'amiz:</strong> Ism, telefon raqam, email (ixtiyoriy), e'lon ma'lumotlari.</p>
<p><strong>Ma'lumotlardan qanday foydalanamiz:</strong> Faqat platforma xizmatlarini taqdim etish uchun. Uchinchi shaxslarga sotilmaydi.</p>
<p><strong>Ma'lumotlarni himoya qilish:</strong> Barcha ma'lumotlar shifrlangan holda saqlanadi. Parollar bcrypt algoritmi bilan himoyalangan.</p>
<p><strong>Huquqlaringiz:</strong> Istalgan vaqtda ma'lumotlaringizni ko'rish, tahrirlash yoki o'chirish so'rovini yuborishingiz mumkin.</p>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}