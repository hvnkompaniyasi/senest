import { PrismaClient } from "@prisma/client"

const neonUrl = process.env.DATABASE_URL_NEON || process.env.NEON
const rwUrl = process.env.DATABASE_URL_RAILWAY || process.env.RAILWAY

async function compare(table: string, field: string) {
  const neon = new PrismaClient({ datasources: { db: { url: neonUrl } } })
  const rw = new PrismaClient({ datasources: { db: { url: rwUrl } } })
  
  // @ts-ignore - dynamic table access
  const n: Array<{ id: string; [key: string]: unknown }> = await neon[table.toLowerCase()].findMany({ select: { id: true, [field]: true } })
  // @ts-ignore - dynamic table access
  const r: Array<{ id: string; [key: string]: unknown }> = await rw[table.toLowerCase()].findMany({ select: { id: true, [field]: true } })
  
  console.log(`=== ${table} ===`)
  console.log('NEON IDs:', n.map((x: { id: string }) => x.id).join(', '))
  console.log('RAILWAY IDs:', r.map((x: { id: string }) => x.id).join(', '))
  const match = n.length === r.length && n.every((item: { id: string; [key: string]: unknown }) => r.find((ri: { id: string; [key: string]: unknown }) => ri.id === item.id && ri[field] === item[field]))
  console.log('MATCH:', match ? '✅' : '❌')
  await neon.$disconnect()
  await rw.$disconnect()
}

(async () => {
  await compare('User', 'email')
  await compare('Listing', 'title')
  await compare('Notification', 'message')
  await compare('ListingEdit', 'status')
  console.log('ROW-LEVEL SOLISHTIRISH TUGADI')
})()