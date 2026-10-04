import Link from "next/link";

interface ListingsPaginationProps {
  total: number;
  page: number;
  perPage: number;
  params: string;
}

export default function ListingsPagination({ total, page, perPage, params }: ListingsPaginationProps) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const base = params ? `/listings?${params}&page=` : "/listings?page=";
  const cls = "h-9 px-4 rounded-xl text-xs font-bold flex items-center border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200 hover:border-[#0A7C4E] transition-colors";
  return (
    <nav className="flex items-center justify-center gap-2 py-6">
      {page > 1 && <Link href={`${base}${page - 1}`} className={cls}>← Oldingi</Link>}
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 px-2">
        {page} / {pages}
      </span>
      {page < pages && <Link href={`${base}${page + 1}`} className={cls}>Keyingi →</Link>}
    </nav>
  );
}
