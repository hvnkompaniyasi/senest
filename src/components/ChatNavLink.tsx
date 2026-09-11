"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"

export default function ChatNavLink() {
  const { data: session } = useSession()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!session) return
    const load = () =>
      fetch("/api/conversations")
        .then((r) => r.json())
        .then((d) => setUnread(d.unreadTotal || 0))
        .catch(() => {})
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [session])

  if (!session) return null

  return (
    <Link
      href="/messages"
      aria-label="Xabarlar"
      className="relative w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md hover:scale-110 transition-transform"
    >
      <MessageSquare className="h-4 w-4" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  )
}
