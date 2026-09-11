"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function LogoutItem() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-red-50 dark:active:bg-red-500/10 transition-colors"
    >
      <span className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
        <LogOut className="h-4 w-4 text-red-500" />
      </span>
      <span className="flex-1 text-left text-sm font-semibold text-red-500">Akkauntdan chiqish</span>
    </button>
  )
}
