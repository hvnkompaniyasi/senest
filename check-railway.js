const { PrismaClient } = require('@prisma/client')
const railUrl = process.env.RAILWAY || 'postgresql://postgres:***@metro.proxy.rlwy.net:29091/railway?sslmode=require'
async function main() {
  const prisma = new PrismaClient({ datasources: { db: { url: railUrl } } })
  try {
    const count = await prisma.listing.count()
    console.log('RAILWAY LISTING COUNT:', count)
  } catch (e) {
    console.error('DB ERROR:', e.message)
  }
}
main()
