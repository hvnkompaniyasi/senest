const { PrismaClient } = require('@prisma/client')

function countToStr(val) {
  if (val === null || val === undefined) return '0'
  if (typeof val === 'number') return String(val)
  if (typeof val === 'string') return val
  if (val.c !== undefined) return String(val.c)
  if (Array.isArray(val) && val[0] && val[0].c !== undefined) return String(val[0].c)
  if (Array.isArray(val) && val[0] && val[0].count !== undefined) return String(val[0].count)
  return JSON.stringify(val)
}

async function checkDB(label, url) {
  console.log(`\n=== ${label} ===`)
  console.log(`URL masked: postgres://postgres:***@metro...`)
  const p = new PrismaClient({ datasources: { db: { url } } })
  const tables = ['Listing','User','Message','Conversation','Favorite','Notification','ListingEdit']
  for (const t of tables) {
    try {
      const res = await p.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "${t}"`)
      const countStr = countToStr(res)
      console.log(`  ${t}: ${countStr}`)
    } catch (e) {
      console.log(`  ${t}: XATO - ${e.message}`)
    }
  }
  await p.$disconnect()
}

(async () => {
  await checkDB('NEON DIRECT', process.env.DATABASE_URL_NEON || process.env.NEON)
  await checkDB('RAILWAY DIRECT', process.env.DATABASE_URL_RAILWAY || process.env.RAILWAY)
  await checkDB('RAILWAY POOLED', (process.env.DATABASE_URL_RAILWAY || process.env.RAILWAY || '').replace('?', '?pgbouncer=true&connection_limit=1&'))
})()
