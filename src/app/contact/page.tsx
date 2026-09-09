import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Aloqa - Senest",
}

export default function StaticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-10">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Aloqa
          </h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
            <p>Biz bilan bog'lanish uchun quyidagi usullardan foydalanishingiz mumkin:</p>
<p><strong>Telefon:</strong> +998 90 123 45 67</p>
<p><strong>Email:</strong> info@senest.uz</p>
<p><strong>Manzil:</strong> Toshkent shahri, Amir Temur ko'chasi, 108-uy</p>
<p><strong>Ish vaqti:</strong> Dushanba - Shanba, 9:00 - 18:00</p>
<p>Savollaringiz bo'lsa, bemalol murojaat qiling. Bizning jamoamiz sizga yordam berishdan xursand bo'ladi!</p>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}