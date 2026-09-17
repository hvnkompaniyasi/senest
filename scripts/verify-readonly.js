const { PrismaClient } = require('@prisma/client')

const urls = {
  NEON: process.env.DATABASE_URL_NEON || process.env.NEON,
  RAILWAY_DIRECT: process.env.DATABASE_URL_RAILWAY || process.env.RAILWAY || '',
  RAILWAY_POOLED: (process.env.DATABASE_URL_RAILWAY || process.env.RAILWAY || '').replace('?', '?pgbouncer=true&connection_limit=1&'),
  RAILWAY_LIMIT: ((process.env.DATABASE_URL_RAILWAY || process.env.RAILWAY || '').includes('?') ? '&' : '?') + 'connection_limit=1'
}

async function checkDB(label, url) {
  console.log(`\n=== ${label} ===`)
  console.log(`URL: ${url ? url.replace(/:[^:]+@/, ':***@') : 'YOQ'}`)
  if (!url || url.includes('***')) {
    console.log('  SKIP — URL masked yoki yoq (read-only tekshiruv)')
    return
  }
  try {
    const p = new PrismaClient({ datasources: { db: { url } } })
    const tables = ['Listing', 'User', 'Message', 'Conversation', 'Favorite', 'Notification', 'ListingEdit']
    for (const t of tables) {
      try {
        const res = await p.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "${t}"`)
        const count = res[0]?.c || res[0] || 0
        console.log(`  ${t}: ${count}`)
      } catch (e) {
        console.log(`  ${t}: XATO - ${e.message}`)
      }
    }
    await p.$disconnect()
  } catch (e) {
    console.log(`  DB CONNECTION XATO: ${e.message}`)
  }
}

(async () => {
  await checkDB('NEON DIRECT', urls.NEON)
  await checkDB('RAILWAY DIRECT (no pooler)', urls.RAILWAY_DIRECT)
  await checkDB('RAILWAY POOLED (pgbouncer=true)', urls.RAILWAY_POOLED)
  await checkDB('RAILWAY DIRECT + limit=1', urls.RAILWAY_LIMIT)
  console.log('\n=== READ-ONLY TEKSHIRUV TUGADI ===')
  console.log('Hech qanday yozuv (INSERT/UPDATE/DELETE/TRUNCATE) bajarilmadi.')
})()
