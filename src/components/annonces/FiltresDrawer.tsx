// src/components/annonces/FiltresDrawer.tsx
// "use client" car on gère l'ouverture/fermeture du drawer
"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { SearchFilter } from "./SearchFilter"

type Props = {
  categories: { slug: string; nom: string }[]
  totalAnnonces: number
}

export function FiltresDrawer({ categories, totalAnnonces }: Props) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <>
      {/* Bouton flottant pour ouvrir les filtres — visible uniquement sur mobile */}
      <button
        onClick={() => setOuvert(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtres & Recherche
      </button>

      {/* Overlay sombre derrière le drawer */}
      {ouvert && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setOuvert(false)}
        />
      )}

      {/* Drawer qui monte depuis le bas */}
      {/* "translate-y-full" = caché en bas, "translate-y-0" = visible */}
      <div className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        bg-white rounded-t-2xl shadow-2xl
        transition-transform duration-300 ease-out
        max-h-[85vh] overflow-y-auto
        ${ouvert ? "translate-y-0" : "translate-y-full"}
      `}>
        {/* Handle visuel en haut du drawer */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header du drawer */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-bold text-gray-900">Filtres & Recherche</span>
          <button
            onClick={() => setOuvert(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu — le même composant SearchFilter */}
        <div className="p-4">
          <SearchFilter categories={categories} />
        </div>

        {/* Bouton "Voir les résultats" en bas */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={() => setOuvert(false)}
            className="w-full btn-turquoise py-3 rounded-xl text-base"
          >
            Voir {totalAnnonces} annonce{totalAnnonces > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  )
}