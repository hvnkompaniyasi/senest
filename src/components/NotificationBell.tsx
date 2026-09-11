"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck } from "lucide-react"
import PushEnable from "@/components/PushEnable"

interface Notif {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

const timeAgo = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return "hozir"
  if (m < 60) return `${m} daqiqa oldin`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} soat oldin`
  return `${Math.floor(h / 24)} kun oldin`
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const router = useRouter()
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!session) return
    const load = () =>
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => setNotifs(d.notifications || []))
        .catch(() => {})
    load()
    const t = setInterval(load, 20000)
    return () => clearInterval(t)
  }, [session])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  if (!session) return null
  const unread = notifs.filter((n) => !n.read).length

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" }).catch(() => {})
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const readAll = async () => {
    await fetch("/api/notifications/read-all", { method: "POST" }).catch(() => {})
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))
  }

  const clickNotif = (n: Notif) => {
    if (!n.read) markRead(n.id)
    setOpen(false)
    if (n.link) router.push(n.link)
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Bildirishnomalar"
        className="relative w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800 border border-white/70 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md hover:scale-110 transition-transform"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
            <span className="font-bold text-sm text-gray-800 dark:text-white">Bildirishnomalar</span>
            {unread > 0 && (
              <button onClick={readAll} className="text-xs font-semibold text-orange-600 flex items-center gap-1">
                <CheckCheck className="h-3.5 w-3.5" /> Hammasini o'qish
              </button>
            )}
          </div>

          <PushEnable />

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">Bildirishnomalar yo'q</div>
            ) : (
              notifs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => clickNotif(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-zinc-800/50 hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors ${
                    n.read ? "" : "bg-orange-50/50 dark:bg-orange-500/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">{n.title}</div>
                      {n.body && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</div>}
                      <div className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
