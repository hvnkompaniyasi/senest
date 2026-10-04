"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, Rows3, Map as MapIcon } from "lucide-react";

const VIEWS = [
  { id: "grid", icon: LayoutGrid, label: "Grid" },
  { id: "large", icon: Rows3, label: "Ro'yxat" },
  { id: "map", icon: MapIcon, label: "Xarita" },
];

export default function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const view = sp.get("view") || "grid";

  function setView(v: string) {
    const params = new URLSearchParams(sp.toString());
    if (v === "grid") params.delete("view");
    else params.set("view", v);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="glass flex items-center gap-1 p-1 rounded-xl">
      {VIEWS.map((v) => {
        const Icon = v.icon;
        const active = view === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`h-8 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              active
                ? "bg-[#0A7C4E] text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
