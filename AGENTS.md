<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Senest — To'liq Arxitektura Qo'llanmasi

## 1. Loyiha haqida
Nomi: Senest. Maqsadi: O'zbekiston ko'chmas mulk bozori platformasi. Asosiy funksiyalar: listing, qidiruv, agent aloqasi. Tech stack: Next.js, TypeScript, Prisma, Tailwind, shadcn/ui. Target: O'zbekiston foydalanuvchilari.

## 2. Kod standartlari
TypeScript strict, any taqiqlanadi, explicit types. Naming: camelCase (var), PascalCase (component), kebab-case (fayl). Feature-based tuzilma. Komponent ≤150 qator. Funksiya ≤50 qator, single responsibility. Import tartibi: external → internal → relative → types.

## 3. Xavfsizlik qoidalari (MAJBURIY)
Barcha input zod bilan validatsiya. API kalitlar faqat .env. dangerouslySetInnerHTML taqiqlangan (XSS). SQL injection: faqat Prisma ORM. Auth: next-auth, JWT. Authorization: har API route tekshiruv. Rate limiting: middleware. CSRF: next-auth token. XSS: React escape. NEXTAUTH_SECRET majburiy.

## 4. Performance qoidalari
next/image har rasm uchun. Dynamic imports (React.lazy) katta komponentlar uchun. useMemo/useCallback og'ir hisob-kitoblar. Caching: ISR/SWR. Bundle ≤300 KB. Lighthouse 90+.

## 5. SEO va Accessibility
Har sahifa: meta title, description, og:image. Semantic HTML. Alt text har rasm. ARIA labels interaktiv elementlarga. Heading h1→h2→h3 tartib. Sitemap.xml va robots.txt.

## 6. Error handling
try/catch har async funksiyada. Error boundaries har sahifa. Loading: skeleton/spinner. User xabarlari o'zbek tilida. Logging: console.error / Sentry.

## 7. Testing qoidalari
Unit testlar: utility funksiyalar. Integration: API route'lar. E2E: Playwright, asosiy flow. Coverage 70%+. TDD: avval test, keyin implement.

## 8. Git workflow
Branch: main (prod), dev (dev), feature/*. Commit: Conventional Commits. PR: dev'ga. Code review majburiy (1 tasdiq). Merge: squash.

## 9. Deploy qoidalari
Vercel: avtomatik (main→prod, feature→preview). Env: Vercel Dashboard. DB migrations: Prisma migrate deploy. Rollback: Vercel bir klik. Monitoring: Vercel Analytics + Sentry.

## 10. Loyiha strukturasi
senest/
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── tests/
└── AGENTS.md

## 11. Til qoidalari
UI: o'zbek. Kod izohlari: ingliz. Commit: ingliz. Hujjat: o'zbek + ingliz.

## 12. ECC qoidalari integratsiyasi
Plan → Test → Implement → Review → Verify → Remember. Har feature avval plan. TDD. Har deploydan keyin verification loop. Xotira: muhim qarorlar saqlanadi.

MUHIM: Bu fayl har AI agent tomonidan o'qiladi va qoidalarga amal qilinadi. Yangilanishlar PR orqali.
