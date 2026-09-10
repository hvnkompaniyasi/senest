const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`

const demoListings = [
  {
    title: "3-xonali kvartira, Chilonzor",
    description: "Chilonzor tumanida joylashgan 3-xonali kvartira sotiladi. Yaxshi ta'mirlangan, barcha qulayliklar mavjud. Maktab va bozor yaqin.",
    type: "SALE", category: "APARTMENT", price: 85000,
    region: "Toshkent shahri", district: "Chilonzor", address: "Bunyodkor ko'chasi 15",
    rooms: 3, area: 78, floor: 5,
    images: [img("photo-1522708323590-d24dbb6b0267"), img("photo-1493809842364-78817add7ffb")],
  },
  {
    title: "2-xonali kvartira, ijara, Yunusobod",
    description: "Yunusobod tumanida 2-xonali kvartira ijaraga beriladi. Mebel bilan, metro yaqin. Oylik to'lov.",
    type: "RENT", category: "APARTMENT", price: 450,
    region: "Toshkent shahri", district: "Yunusobod", address: "Amir Temur ko'chasi 42",
    rooms: 2, area: 55, floor: 3,
    images: [img("photo-1493809842364-78817add7ffb"), img("photo-1560448204-e02f11c3d0e2")],
  },
  {
    title: "4-xonali uy, Samarqand markazi",
    description: "Samarqand shahri markazida 4-xonali hovli sotiladi. Katta hovli, bog', garaj bor. Barcha kommunikatsiyalar ulangan.",
    type: "SALE", category: "HOUSE", price: 120000,
    region: "Samarqand viloyati", district: "Samarqand shahri", address: "Registon ko'chasi 8",
    rooms: 4, area: 140, floor: 2,
    images: [img("photo-1568605114967-8130f3a36994"), img("photo-1570129477492-45c003edd2be")],
  },
  {
    title: "Ofis 120 m2, Mirobod",
    description: "Mirobod tumanida zamonaviy ofis binosi sotiladi. 120 kvadrat metr, 4 xona, parking, lift. Biznes markazida.",
    type: "SALE", category: "OFFICE", price: 95000,
    region: "Toshkent shahri", district: "Mirobod", address: "Shahrisabz ko'chasi 5",
    rooms: 4, area: 120, floor: 3,
    images: [img("photo-1497366216548-37526070297c"), img("photo-1524758631624-e2822e304c36")],
  },
  {
    title: "Yer maydoni 6 sotix, Qibray",
    description: "Qibray tumanida 6 sotix yer maydoni sotiladi. Turar joy qurish uchun. Elektr, gaz, suv mavjud.",
    type: "SALE", category: "LAND", price: 45000,
    region: "Toshkent viloyati", district: "Qibray", address: "Yangi qishloq MFY",
    rooms: null, area: 600, floor: null,
    images: [img("photo-1500382017468-9049fed747ef")],
  },
  {
    title: "Ombor 500 m2, Sergeli",
    description: "Sergeli tumanida 500 kvadrat metr ombor sotiladi. Balandlik 6 metr, yuk mashinalari uchun qulay kirish.",
    type: "SALE", category: "WAREHOUSE", price: 320000,
    region: "Toshkent shahri", district: "Sergeli", address: "Sergeli ko'chasi 120",
    rooms: null, area: 500, floor: 1,
    images: [img("photo-1553413077-190dd305871c")],
  },
  {
    title: "1-xonali kvartira, ijara, Buxoro",
    description: "Buxoro shahri markazida 1-xonali kvartira ijaraga. Ta'mirlangan, mebel bilan. Talabalar va yosh oilalar uchun qulay.",
    type: "RENT", category: "APARTMENT", price: 250,
    region: "Buxoro viloyati", district: "Buxoro shahri", address: "Nakshband ko'chasi 12",
    rooms: 1, area: 38, floor: 2,
    images: [img("photo-1502672260266-1c1ef2d93688")],
  },
  {
    title: "5-xonali hovli, Farg'ona",
    description: "Farg'ona shahrida 5-xonali katta hovli sotiladi. 2 qavatli, bog', anor va uzum daraxtlari. Issiqxonasi bor.",
    type: "SALE", category: "HOUSE", price: 180000,
    region: "Farg'ona viloyati", district: "Farg'ona shahri", address: "Al-Farg'oniy ko'chasi 33",
    rooms: 5, area: 210, floor: 2,
    images: [img("photo-1570129477492-45c003edd2be"), img("photo-1568605114967-8130f3a36994")],
  },
  {
    title: "2-xonali kvartira, ijara, Xiva",
    description: "Xiva shahrida 2-xonali kvartira ijaraga beriladi. Eski shahar yaqin, sayyohlik mavsumida ham qulay.",
    type: "RENT", category: "APARTMENT", price: 300,
    region: "Xorazm viloyati", district: "Xiva shahri", address: "Ichan-Qal'a ko'chasi 7",
    rooms: 2, area: 60, floor: 1,
    images: [img("photo-1560448204-e02f11c3d0e2"), img("photo-1522708323590-d24dbb6b0267")],
  },
  {
    title: "Ofis ijara, Shayxontohur",
    description: "Shayxontohur tumanida 85 m2 ofis ijaraga. 3 xona, qabulxona, sanitär tugun. Markaziy ko'chada.",
    type: "RENT", category: "OFFICE", price: 800,
    region: "Toshkent shahri", district: "Shayxontohur", address: "Navoiy ko'chasi 21",
    rooms: 3, area: 85, floor: 4,
    images: [img("photo-1524758631624-e2822e304c36"), img("photo-1497366216548-37526070297c")],
  },
]

async function main() {
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log("❌ User topilmadi! Avval ro'yxatdan o'ting.")
    return
  }

  const titles = demoListings.map((l) => l.title)
  await prisma.listing.deleteMany({ where: { title: { in: titles } } })

  for (const l of demoListings) {
    await prisma.listing.create({
      data: { ...l, status: "ACTIVE", currency: "USD", userId: user.id },
    })
  }

  console.log(`✅ ${demoListings.length} ta demo e'lon qo'shildi (rasmlar bilan)!`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
