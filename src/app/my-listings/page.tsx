import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/auth"
import { authOptions } from "@/lib/auth-options"
import Navbar from "@/components/Navbar"
import MobileNav from "@/components/MobileNav"
import DeleteListingButton from "@/components/DeleteListingButton"
import { Pencil, Home, Clock, CheckCircle, XCircle, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

const statusMap: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  PENDING: { label: "Ko'rikda", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400", icon: Clock },
  ACTIVE: { label: "Faol", cls: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400", icon: CheckCircle },
  SOLD: { label: "Sotilgan", cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400", icon: CheckCircle },
  EXPIRED: { label: "Muddati tugagan", cls: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400", icon: XCircle },
  REJECTED: { label: "Rad etilgan", cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400", icon: XCircle },
}

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login?callbackUrl=/my-listings")

  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      edits: { where: { status: "PENDING" }, take: 1, orderBy: { createdAt: "desc" } },
    },
  })

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950 pb-24 lg:pb-10">
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Mening e'lonlarim</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{listings.length} ta e'lon</p>
          </div>
          <Link href="/add-listing" className="h-10 px-4 bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-orange-400/30 flex-shrink-0">
            <Plus className="h-4 w-4" /> Yangi e'lon
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <Home className="h-12 w-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Hali e'lonlaringiz yo'q</p>
            <Link href="/add-listing" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#FF9500] to-[#FF7A00] text-white text-sm font-bold rounded-xl">
              <Plus className="h-4 w-4" /> Birinchi e'lonni qo'shish
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => {
              const st = statusMap[l.status] || statusMap.PENDING
              const StIcon = st.icon
              const hasPendingEdit = l.edits.length > 0
              return (
                <div key={l.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  {/* Yuqori qism: rasm + ma'lumot */}
                  <div className="flex gap-3.5">
                    {l.images?.[0] ? (
                      <Link href={`/listing/${l.id}`} className="flex-shrink-0">
                        <img src={l.images[0]} alt="" className="w-24 h-24 rounded-xl object-cover" />
                      </Link>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-orange-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <Home className="h-8 w-8 text-orange-300" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/listing/${l.id}`} className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug hover:text-[#FF9500]">
                          {l.title || "Sarlavhasiz"}
                        </Link>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 flex-shrink-0 ${st.cls}`}>
                          <StIcon className="h-3 w-3" /> {st.label}
                        </span>
                      </div>
                      <div className="text-base font-extrabold text-[#FF9500] mt-1">
                        ${l.price.toLocaleString("en-US")}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {l.region}{l.district ? `, ${l.district}` : ""}
                      </div>
                      {hasPendingEdit && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-semibold">
                          <Clock className="h-3 w-3" /> O'zgarish ko'rikda
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pastki qism: tugmalar (to'liq kenglik - kesilmaydi) */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                    <Link
                      href={`/edit-listing/${l.id}`}
                      className="flex-1 h-10 px-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                    >
                      <Pencil className="h-4 w-4" /> Tahrirlash
                    </Link>
                    <DeleteListingButton id={l.id} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
