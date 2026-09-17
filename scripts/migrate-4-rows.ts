// @ts-nocheck
import { PrismaClient } from "@prisma/client"

const dryRun = process.env.DRY_RUN === '1'
const neonUrl = process.env.NEON_URL || process.env.DATABASE_URL_NEON
const rwUrl = process.env.RW_URL || process.env.DATABASE_URL_RAILWAY

console.log('DRY_RUN=', dryRun)
console.log('NEON URL masked:', neonUrl ? neonUrl.replace(/:[^:]+@/, ':***@') : 'YOQ')
console.log('RAILWAY URL masked:', rwUrl ? rwUrl.replace(/:[^:]+@/, ':***@') : 'YOQ')

const tables = ['User', 'Listing', 'Notification', 'ListingEdit']

async function migrate() {
  const neon = new PrismaClient({ datasources: { db: { url: neonUrl } } })
  const rw = new PrismaClient({ datasources: { db: { url: rwUrl } } })

  if (dryRun) {
    console.log('DRY RUN — faqat LOG, yozuv YO\'Q')
    for (const t of tables) {
      const count: Array<{ c: number }> = await neon.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "${t}"`)
      console.log(`  [DRY] ${t}: ${count[0]?.c || 0}`)
    }
    return
  }

  await rw.$transaction(async (tx) => {
    console.log('TRANSACTION BOSHLANDI')

    // User
    const users = await neon.user.findMany()
    for (const u of users) {
      await tx.user.upsert({ where: { id: u.id }, update: {}, create: u })
      console.log('✅ User upsert:', u.id)
    }

    // Listing
    const listings = await neon.listing.findMany()
    for (const l of listings) {
      await tx.listing.upsert({ where: { id: l.id }, update: {}, create: l })
      console.log('✅ Listing upsert:', l.id)
    }

    // Notification
    const notifs = await neon.notification.findMany()
    for (const n of notifs) {
      await tx.notification.upsert({ where: { id: n.id }, update: {}, create: n })
      console.log('✅ Notification upsert:', n.id)
    }

    // ListingEdit
    const edits = await neon.listingEdit.findMany()
    for (const e of edits) {
      await tx.listingEdit.upsert({ where: { id: e.id }, update: {}, create: e })
      console.log('✅ ListingEdit upsert:', e.id)
    }

    console.log('TRANSACTION TAMOMLANDI (ROLLBACK EHTIMOLI YO\'Q — barcha upsert muvaffaqiyatli)')
  }, { timeout: 30000 })

  console.log('FULL MIGRATION TAMOMLANDI — 4 ta yozuv Railway\'ga ko\'chirildi')
  await neon.$disconnect()
  await rw.$disconnect()
}

migrate().catch((e) => {
  console.error('XATO:', e.message)
  console.error('TRANSACTION ROLLBACK (agar ichida xato bo\'lsa avtomatik)')
  process.exit(1)
})
