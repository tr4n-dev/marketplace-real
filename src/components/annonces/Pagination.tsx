// src/components/annonces/Pagination.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  pageActuelle: number
  totalPages: number
}

export function Pagination({ pageActuelle, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  // Génère les numéros de pages à afficher
  // Ex: si on est page 5/10 → [1, "...", 4, 5, 6, "...", 10]
  const pages: (number | "...")[] = []
  if (totalPages <= 7) {
    // Peu de pages → on affiche tout
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (pageActuelle > 3) pages.push("...")
    for (let i = Math.max(2, pageActuelle - 1); i <= Math.min(totalPages - 1, pageActuelle + 1); i++) {
      pages.push(i)
    }
    if (pageActuelle < totalPages - 2) pages.push("...")
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Bouton précédent */}
      <button
        onClick={() => goToPage(pageActuelle - 1)}
        disabled={pageActuelle === 1}
        className="p-2 rounded-xl border-2 border-gray-200 hover:border-turquoise disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Numéros de pages */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-10 h-10 rounded-xl border-2 text-sm font-semibold transition-all ${
              p === pageActuelle
                ? "border-turquoise bg-turquoise text-white"
                : "border-gray-200 hover:border-turquoise text-gray-700"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Bouton suivant */}
      <button
        onClick={() => goToPage(pageActuelle + 1)}
        disabled={pageActuelle === totalPages}
        className="p-2 rounded-xl border-2 border-gray-200 hover:border-turquoise disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}