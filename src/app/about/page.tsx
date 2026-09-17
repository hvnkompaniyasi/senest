import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Biz haqimizda - Olsot Market",
}

export default function StaticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-10">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Biz haqimizda
          </h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
            <p>Olsot Market - O'zbekistonning eng zamonaviy ko'chmas mulk platformasi. Biz 2026-yilda tashkil etilgan bo'lib, maqsadimiz odamlarga uy-joy topish va sotishda yordam berishdir.</p>
<p>Bizning platformamiz orqali minglab odamlar o'z orzularidagi uy-joyni topdilar. Biz har bir e'lonni moderatsiyadan o'tkazamiz va foydalanuvchilarimiz xavfsizligini ta'minlaymiz.</p>
<p><strong>Bizning qadriyatlarimiz:</strong></p>
<ul>
<li>Ishonchlilik - har bir e'lon tekshirilgan</li>
<li>Shaffoflik - yashirin to'lovlar yo'q</li>
<li>Qulaylik - oddiy va tushunarli interfeys</li>
<li>Zamonaviylik - eng so'nggi texnologiyalar</li>
</ul>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}