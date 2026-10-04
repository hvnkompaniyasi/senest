const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const IMG = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
];

const USERS = [
  { name: "Aziza Karimova", phone: "+998331234501" },
  { name: "Bekzod Toshmatov", phone: "+998331234500" },
  { name: "Dilnoza Rahimova", phone: "+998331234503" },
  { name: "Jasur Aliyev", phone: "+998331234504" },
];

const L = [
  { t: "Chilonzor 12-kvartal, 3 xonali zamonaviy kvartira", r: "Toshkent", d: "Chilonzor", c: "APARTMENT", ty: "SALE", p: 95000, lat: 41.289, lng: 69.214, rooms: 3, area: 78, fl: 4, tf: 9 },
  { t: "Yunusobod, yangi qurilish, 2 xonali", r: "Toshkent", d: "Yunusobod", c: "APARTMENT", ty: "SALE", p: 72000, lat: 41.364, lng: 69.298, rooms: 2, area: 56, fl: 7, tf: 16 },
  { t: "Mirzo Ulug'bek, evro remont, 4 xonali", r: "Toshkent", d: "Mirzo Ulug'bek", c: "APARTMENT", ty: "SALE", p: 128000, lat: 41.322, lng: 69.325, rooms: 4, area: 105, fl: 3, tf: 5 },
  { t: "Markazda kunlik ijaraga kvartira (WiFi, TV)", r: "Toshkent", d: "Shayxontohur", c: "APARTMENT", ty: "DAILY", p: 350000, lat: 41.311, lng: 69.240, rooms: 2, area: 48, fl: 5, tf: 9 },
  { t: "Olmazor, ijara, 1 xonali studiya", r: "Toshkent", d: "Olmazor", c: "APARTMENT", ty: "RENT", p: 4500000, lat: 41.340, lng: 69.217, rooms: 1, area: 34, fl: 2, tf: 4 },
  { t: "Sergeli, yangi uy, hovli bilan", r: "Toshkent", d: "Sergeli", c: "HOUSE", ty: "SALE", p: 165000, lat: 41.219, lng: 69.203, rooms: 5, area: 160, fl: 2, tf: 2 },
  { t: "Samarqand markazi, Registan yonida 2 xonali", r: "Samarqand", d: "Samarqand", c: "APARTMENT", ty: "SALE", p: 52000, lat: 39.654, lng: 66.960, rooms: 2, area: 54, fl: 3, tf: 5 },
  { t: "Samarqand, hovli uy, bog' bilan", r: "Samarqand", d: "Samarqand", c: "HOUSE", ty: "SALE", p: 88000, lat: 39.627, lng: 66.975, rooms: 4, area: 140, fl: 1, tf: 1 },
  { t: "Buxoro, eski shahar yonida ijara kvartira", r: "Buxoro", d: "Buxoro", c: "APARTMENT", ty: "RENT", p: 2800000, lat: 39.774, lng: 64.428, rooms: 2, area: 50, fl: 1, tf: 3 },
  { t: "Farg'ona, markaziy ko'cha, 3 xonali", r: "Farg'ona", d: "Farg'ona", c: "APARTMENT", ty: "SALE", p: 46000, lat: 40.386, lng: 71.786, rooms: 3, area: 72, fl: 6, tf: 9 },
  { t: "Andijon, yangi qurilish, 1 xonali", r: "Andijon", d: "Andijon", c: "APARTMENT", ty: "SALE", p: 31000, lat: 40.783, lng: 72.344, rooms: 1, area: 38, fl: 8, tf: 12 },
  { t: "Toshkent, ofis binosi, 120 m2 open space", r: "Toshkent", d: "Yakkasaroy", c: "OFFICE", ty: "RENT", p: 18000000, lat: 41.290, lng: 69.267, rooms: 0, area: 120, fl: 3, tf: 6 },
  { t: "Qibray tumani, 10 sotqa yer uchastkasi", r: "Toshkent", d: "Qibray", c: "LAND", ty: "SALE", p: 55000, lat: 41.508, lng: 69.518, rooms: 0, area: 1000, fl: 0, tf: 0 },
  { t: "Nukus, 2 xonali kvartira, arzon", r: "Qoraqalpog'iston", d: "Nukus", c: "APARTMENT", ty: "SALE", p: 24000, lat: 42.464, lng: 59.600, rooms: 2, area: 46, fl: 4, tf: 5 },
  { t: "Toshkent, Premium Business Center ofis", r: "Toshkent", d: "Shayxontohur", c: "OFFICE", ty: "SALE", p: 210000, lat: 41.317, lng: 69.254, rooms: 0, area: 95, fl: 8, tf: 12 },
];

async function main() {
  const hash = await bcrypt.hash("12345", 10);

  // 1. Users
  const users = [];
  for (const u of USERS) {
    users.push(await prisma.user.upsert({
      where: { phone: u.phone },
      update: {},
      create: { name: u.name, phone: u.phone, password: hash, role: "USER" },
    }));
  }
  console.log("✅ 4 user (parol: 12345)");

  // 2. Listings — har bir user'da 4 ta (16 total, lekin biz 15 qildik)
  const created = [];
  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    created.push(await prisma.listing.upsert({
      where: { id: `demo-listing-${i + 1}` },
      update: {},
      create: {
        id: `demo-listing-${i + 1}`,
        user: { connect: { id: users[i % users.length].id } },
        title: l.t,
        description: `${l.d} tumanida joylashgan qulay va yorug' uy. Gaz, suv, elektr, internet mavjud. Hujjatlar tayyor.`,
        type: l.ty,
        category: l.c,
        price: l.p,
        region: l.r,
        district: l.d,
        address: `${l.d}, ${l.r} shahri`,
        latitude: l.lat,
        longitude: l.lng,
        rooms: l.rooms,
        area: l.area,
        floor: l.fl,
        totalFloors: l.tf,
        hasGas: true,
        hasWater: true,
        hasElectricity: true,
        images: [IMG[i % IMG.length], IMG[(i + 3) % IMG.length]],
        status: i < 13 ? "ACTIVE" : "PENDING",
        isPremium: i === 0 || i === 3,
        premiumUntil: i === 0 || i === 3 ? new Date(Date.now() + 30 * 864e5) : null,
      },
    }));
  }
  console.log("✅ 15 e'lon (13 ACTIVE, 2 PENDING, 2 VIP)");

  // 3. Conversation — user[0]=seller, user[1]=buyer, listing[0]=e'lon
  const conv = await prisma.conversation.upsert({
    where: { id: "demo-conv-1" },
    update: {},
    create: {
      id: "demo-conv-1",
      buyer: { connect: { id: users[1].id } },
      seller: { connect: { id: users[0].id } },
      listing: { connect: { id: created[0].id } },
    },
  });
  console.log("✅ Suvbat yaratildi");

  // 4. Messages (3 ta)
  await prisma.message.createMany({
    data: [
      {
        senderId: users[1].id,
        conversationId: conv.id,
        text: "Assalomu alaykum! Kvartira hali sotuvdami?",
      },
      {
        senderId: users[0].id,
        conversationId: conv.id,
        text: "Vaalaykum assalom! Ha, hali sotuvda. Qachon ko'rishni xohlaysiz?",
      },
      {
        senderId: users[1].id,
        conversationId: conv.id,
        text: "Ertaga soat 15:00 da qulaymi?",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ 3 ta xabar");

  // 5. Favorites
  await prisma.favorite.createMany({
    data: [
      { userId: users[1].id, listingId: created[2].id },
      { userId: users[1].id, listingId: created[3].id },
      { userId: users[2].id, listingId: created[0].id },
    ],
    skipDuplicates: true,
  });
  console.log("✅ 3 ta sevimli");

  await prisma.$disconnect();
  console.log("\n🎉 DEMO TAYYOR!");
  console.log("Login: +998331234500 / 12345 (Bekzod - buyer, chat + sevimlilar bor)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
