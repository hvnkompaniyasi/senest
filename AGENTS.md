# Senest & Senest-Admin — Agent Instructions

## LOYIHA HAQIDA
Senest — O'zbekiston ko'chmas mulk platformasi.
- senest (asosiy): foydalanuvchi platformasi
- senest-admin: moderator panel
- Target: 10K e'lon, 50K user, 500K tashrif (6 oy)

## TECH STACK
- Next.js 14.2.18 (App Router)
- TypeScript 5 (strict, any taqiqlangan)
- Prisma 5.18 + Railway PostgreSQL
- Tailwind 3.4 + shadcn/ui
- next-auth v4 (JWT)

## KOD STANDARTLARI
- camelCase (variables), PascalCase (components), kebab-case (files)
- Komponent ≤ 150 qator
- Funksiya ≤ 50 qator
- Izohlar ingliz, UI o'zbek
- any taqiqlangan

## ARXITEKTURA
- ISR: / = 60s, /listings = static, /listing/[id] = dynamic
- Polling: NotificationBell 60s, MessagesClient 40s
- Cache: system font (next/font yo'q)
- Images: Uploadthing (next/image ga o'tish T4)

## XAVFSIZLIK
- Zod validation — barcha API
- next-auth JWT — session
- Prisma ORM — SQL injection yo'q
- Rate limiting (T1)

## TEGMASLIK KERAK
- prisma/schema.prisma (lead tasdiqisiz)
- vercel.json (crons)
- next-auth config
- middleware auth logic

## GIT
- Branch: main, dev, feature/*
- Commit: Conventional Commits
- PR: dev → main

## HISOBOT
- Nima o'zgardi
- Qaysi fayllar
- Build holati
- Commit hash

## MULOQOT QOIDALARI (MAJBURIY)

1. **Chat javoblari** — barcha javoblar chatda ko'rsatiladi
2. **Fayl yozish** — faqat foydalanuvchi aniq so'raganda ("faylga saqla", "yozib qo'y")
3. **Kod yozish** — kod chatda ham, faylga ham (ikkalasida)
4. **Hisobot** — qisqa xulosa chatda, batafsil faylga (agar kerak)
5. **Hech qachon** — "yozdim" deb javob berma, o'rniga matnni ko'rsat

### Noto'g'ri:
> "README.md ga yozdim"

### To'g'ri:
> "Mana README.md mazmuni:
>
> # Senest
> ...
>
> Faylni saqlashimni xohlasangiz, ayting."
