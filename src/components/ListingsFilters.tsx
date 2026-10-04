"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface ListingsFiltersProps {
  regions: string[];
}

const TYPES = [
  { id: "", name: "Barchasi" },
  { id: "SALE", name: "Sotuv" },
  { id: "RENT", name: "Ijara" },
  { id: "DAILY", name: "Kunlik" },
];

export default function ListingsFilters({ regions }: ListingsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const type = sp.get("type") || "";
  const region = sp.get("region") || "";
  const [q, setQ] = useState(sp.get("q") || "");

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-2.5 pb-4">
      <form
        onSubmit={(e) => { e.preventDefault(); update("q", q.trim()); }}
        className="flex gap-2"
      >
        <div className="flex-1 flex items-center gap-2 h-11 px-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Qidiruv: manzil, sarlavha..."
            className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
        <button type="submit" className="h-11 px-4 bg-[#0A7C4E] text-white rounded-xl text-sm font-bold">
          Qidirish
        </button>
      </form>

      <div className="flex gap-1.5 p-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-x-auto no-scrollbar">
        {TYPES.map((t) => (
          <button
            key={t.id || "all"}
            onClick={() => update("type", t.id)}
            className={`flex-1 h-9 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              type === t.id
                ? "bg-[#0A7C4E] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <select
        value={region}
        onChange={(e) => update("region", e.target.value)}
        className="w-full h-11 px-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none"
      >
        <option value="">Barcha hududlar</option>
        {regions.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
}
