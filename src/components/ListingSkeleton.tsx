export default function ListingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl overflow-hidden shadow-lg animate-pulse">
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-zinc-800 dark:to-zinc-900" />
          <div className="p-4 space-y-2">
            <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="h-5 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-3/4 bg-gray-100 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
