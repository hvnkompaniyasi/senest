"use client"
import { useSession } from "next-auth/react"
import { BarChart, Crown } from "lucide-react"
export default function StatsPage() { const { data } = useSession(); return <div className="p-10 bg-zinc-950 text-white"><h1 className="text-2xl font-bold flex gap-2"><BarChart /> Admin Statistika</h1><p>Admin paneliga xush kelibsiz</p></div> }
