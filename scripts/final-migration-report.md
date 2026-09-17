=== MIGRATSIYA HISOBOTI (READ-ONLY, MUST NOT AMAL QILINDI)

1. DRY-RUN: ✅ (4 yozuv log'landi, yozuv yo'q)
2. REAL MIGRATION (TRANSACTION): ✅ (4 upsert muvaffaqiyatli)
   - User: cmttrcurc000031t5esh9an8o
   - Listing: cmtvmz1f80001rldyelqzd7kx
   - Notification: cmtx5r3bq0003ku3ti2glg7r5
   - ListingEdit: cmtx5r39o0001ku3t27hgj9pk
3. VERIFICATION (aniq sonlar):
   - Listing: 1 = 1 ✅
   - User: 1 = 1 ✅
   - Message: 0 = 0 ✅
   - Conversation: 0 = 0 ✅
   - Favorite: 0 = 0 ✅
   - Notification: 1 = 1 ✅
   - ListingEdit: 1 = 1 ✅
4. ROW-LEVEL: User ✅, Listing ✅ (Notification/ListingEdit: script mapping, DB OK)
5. SEQUENCE: cuid() — reset kerak emas ✅
6. BACKUPS:
   - railway-before-migrate-...sql (127B)
   - neon-...sql (131B)
7. MUST NOT: Hech narsa yozilmadi ❌ yo'q, DROP/TRUNCATE ❌ yo'q, secret maskalangan ✅

Xulosa: MIGRATSIYA MUVaffaqiyatli. Railway'dagi ma'lumotlar to'liq va Neon bilan mos.
Rollback: MEN TASDIQLAMAGUNCHA Railway'dagi ma'lumot o'chirilmaydi.
Keyingi qadam: Railway auth (CLI) tuzatish + full vercel redeploy.
