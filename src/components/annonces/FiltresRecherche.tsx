// src/components/annonces/FiltresRecherche.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

type Props = {
  categories: { slug: string; nom: string }[]
}

export function FiltresRecherche({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // useTransition permet d'afficher un état "chargement" pendant la navigation
  const [isPending, startTransition] = useTransition()

  // Fonction utilitaire : met à jour un param dans l'URL sans effacer les autres
  const setParam = useCallback((nom: string, valeur: string) => {
    // On copie les params existants
    const params = new URLSearchParams(searchParams.toString())

    if (valeur) {
      params.set(nom, valeur)
    } else {
      params.delete(nom) // Si valeur vide, on supprime le param
    }

    // On remet la page à 1 quand on change un filtre
    params.delete("page")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }, [router, pathname, searchParams])

  // Remet tous les filtres à zéro
  const reset = () => {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const aDesFiltres = searchParams.toString() !== ""

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 transition-opacity ${isPending ? "opacity-60" : ""}`}>

      {/* Header filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="w-4 h-4 text-turquoise" />
          Filtres
        </div>
        {aDesFiltres && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Recherche */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Recherche
        </label>
        <div className="flex items-center border-2 border-gray-200 focus-within:border-turquoise rounded-xl overflow-hidden transition-colors">
          <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher… Karohy"
            defaultValue={searchParams.get("recherche") ?? ""}
            onChange={(e) => setParam("recherche", e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Catégorie
        </label>
        <select
          value={searchParams.get("categorie") ?? ""}
          onChange={(e) => setParam("categorie", e.target.value)}
          className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Ville */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Ville / Tanàna
        </label>
        <select
          value={searchParams.get("ville") ?? ""}
          onChange={(e) => setParam("ville", e.target.value)}
          className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white"
        >
          <option value="">Toute Madagascar</option>
          {["Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa", "Toliara", "Antsiranana"].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Prix */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Prix (Ariary)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("prixMin") ?? ""}
            onChange={(e) => setParam("prixMin", e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("prixMax") ?? ""}
            onChange={(e) => setParam("prixMax", e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* Type de prix */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { valeur: "", label: "Tous" },
            { valeur: "FIXE", label: "Prix fixe" },
            { valeur: "NEGOCIABLE", label: "Négociable" },
            { valeur: "GRATUIT", label: "Gratuit" },
          ].map((opt) => (
            <button
              key={opt.valeur}
              onClick={() => setParam("typePrix", opt.valeur)}
              className={`text-xs py-2 px-3 rounded-xl border-2 font-medium transition-all ${
                (searchParams.get("typePrix") ?? "") === opt.valeur
                  ? "border-turquoise bg-turquoise text-white"
                  : "border-gray-200 text-gray-600 hover:border-turquoise"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}