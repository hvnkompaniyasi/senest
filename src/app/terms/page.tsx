import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Foydalanish shartlari - Senest",
}

export default function StaticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Card className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-10">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Foydalanish shartlari
          </h1>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
            <p>Senest platformasidan foydalanish orqali siz quyidagi shartlarga rozilik bildirasiz:</p>
<p><strong>1. E'lon joylashtirish:</strong> E'lonlar faqat haqiqiy ma'lumotlarni o'z ichiga olishi kerak. Yolg'on yoki aldamchi e'lonlar o'chiriladi.</p>
<p><strong>2. Mas'uliyat:</strong> Platforma foydalanuvchilar o'rtasidagi bitimlar uchun javob bermaydi, lekin mojaroli holatlarda yordam beradi.</p>
<p><strong>3. Moderatsiya:</strong> Barcha e'lonlar moderatsiyadan o'tadi. Qoidabuzarlik aniqlansa, e'lon o'chiriladi va akkaunt bloklanishi mumkin.</p>
<p><strong>4. To'lovlar:</strong> Asosiy xizmatlar bepul. Qo'shimcha xizmatlar (reklama, ko'tarish) pullik bo'lishi mumkin.</p>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  )
}