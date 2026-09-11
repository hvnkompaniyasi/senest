"use client"

import { useEffect, useState } from "react"
import { BellRing, BellOff, Loader2 } from "lucide-react"

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray as BufferSource
}

export default function PushEnable() {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!VAPID_PUBLIC) return
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator) || !("Notification" in window) || !("PushManager" in window)) return
    setSupported(true)
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(!!sub))
      .catch(() => {})
  }, [])

  if (!supported) return null

  const toggle = async () => {
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()

      if (existing) {
        await existing.unsubscribe()
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: existing.endpoint }),
        }).catch(() => {})
        setEnabled(false)
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== "granted") return

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      })
      const json = sub.toJSON()
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      })
      setEnabled(true)
    } catch {
      // jim qolamiz
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-semibold transition-colors border-b border-gray-100 dark:border-zinc-800 ${
        enabled
          ? "text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-500/5"
          : "text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/5"
      }`}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : enabled ? (
        <BellRing className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      {enabled ? "Push bildirishnomalar yoqilgan" : "Push bildirishnomalarni yoqish"}
    </button>
  )
}
