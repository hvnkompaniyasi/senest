# Senest

O'zbekiston ko'chmas mulk platformasi.

## Loyiha haqida
Senest — ishonchli ko'chmas mulk e'lonlari platformasi. Asosiy funksiyalar: listing, qidiruv, agent aloqasi, admin panel.

## Tech Stack
- Next.js 14.2.18 (App Router, TypeScript strict)
- Prisma 5.18.0 (PostgreSQL — Railway)
- Tailwind CSS + shadcn/ui
- next-auth (JWT auth)
- Zod (validatsiya)
- Vitest (3 ta unit test)

## Deploy qoidalari
- Vercel (avtomatik): `main` → production; `feature/*` → preview
- Database: Railway Postgres (Pooled: `pgbouncer=true&connection_limit=1`)
- `.env.local`: DATABASE_URL = Railway POOLED string (maskalangan)
- Build: `npm run build` (SIGABRT oldin mavjud — resurs cheklovi)
- Migration: `prisma db push` → `scripts/full-migrate.ts` (FALLBACK)

## Backup tizimi
- Har kuni 03:00 (`crontab`): `/opt/data/senest/scripts/backup-db.sh`
- Backup joyi: `/opt/data/backups/`
- Retention: 7 kun (`find ... -mtime +7 -delete`)
- DIRECT URL: Railway `DATABASE_PUBLIC_URL` (pgbouncer=false, sslmode=require)
- Telegram notification: `TELEGRAM_BOT_TOKEN` (`***` maskalangan)

## Monitoring tizimi
- Har 6 soat (`crontab`): `/opt/data/senest/scripts/monitor-db.sh`
- Tekshirish: `curl` site + `curl` API + `prisma` DB count
- Log: `/opt/data/backups/monitor-log.log`
- Telegram alert (xatolik bo'lsa): `curl` API

## Docker
- `Dockerfile`: multi-stage (node:18-alpine)
- `docker-compose.yml`: `web` (Next.js) + `db` (postgres:15-alpine)
- Build: `docker-compose up --build`

## Xavfsizlik
- Input validatsiya: Zod
- API kalitlar: `.env.local` (commit qilinmagan, `***` maskalangan)
- Rate limiting: `middleware.ts` (`POST`/`PATCH`/`DELETE` → 60/min, 429 o'zbek)
- Auth: `next-auth` + JWT
- SQL injection: faqat Prisma ORM
- XSS: React automatic escape
- CSRF: `next-auth` token
- NEXTAUTH_SECRET: `.env` (majburiy)
- Secret'lar: `.env.local` + `gitignore`; `git log -S` bo'sh

## Testing
- Unit testlar: `tests/` (`vitest.config.ts`)
- Coverage maqsadi: 70%+
- E2E: Playwright (tavsiya)

## Skills
- `autonomous-ai-agents` (multi-agent protocol: `git pull` avval, bitta yozuvchi, `Plan → Test → Implement → Review → Verify`)

## Muallif
Senest — hvnkompaniyasi / HVN
