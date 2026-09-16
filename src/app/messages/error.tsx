"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold mb-4">Xatolik yuz berdi</h2>
      <p className="mb-4">{error.message || "Noma'lom xatolik"}</p>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded">Qayta urinish</button>
    </div>
  )
}
