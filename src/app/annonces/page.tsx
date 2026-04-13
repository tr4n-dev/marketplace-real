// src/app/annonces/page.tsx
import { Suspense } from "react"
import { getAnnoncesWithFavorites, getCategoriesAvecNombre } from "@/lib/annonces"
import { AnnonceCard } from "@/components/annonces/AnnonceCard"
import { SearchFilter } from "@/components/annonces/SearchFilter"
import { FiltresDrawer } from "@/components/annonces/FiltresDrawer"
import { Pagination } from "@/components/annonces/Pagination"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Toutes les annonces",
}

type Props = {
  searchParams: Promise<{
    recherche?: string
    categorie?: string
    ville?: string
    prixMin?: string
    prixMax?: string
    typePrix?: string
    page?: string
  }>
}

export default async function AnnoncesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page ?? 1)

  // Get session for favorites
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const [{ annonces, total, pages }, categories] = await Promise.all([
    getAnnoncesWithFavorites({
      recherche: params.recherche,
      categorie: params.categorie,
      ville: params.ville,
      prixMin: params.prixMin ? Number(params.prixMin) : undefined,
      prixMax: params.prixMax ? Number(params.prixMax) : undefined,
      typePrix: params.typePrix,
      page,
    }, userId),
    getCategoriesAvecNombre(),
  ])

  const aDesFiltres = Object.values(params).some(Boolean)
  const titrePage = params.recherche
    ? `Résultats pour "${params.recherche}"`
    : params.categorie
    ? (categories.find(c => c.slug === params.categorie)?.nom ?? "Annonces")
    : "Toutes les annonces"

  return (
    // "pb-24" sur mobile = espace pour le bouton flottant filtres
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24 lg:pb-8">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
          {titrePage}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          Filazana rehetra — Madagascar
        </p>
      </div>

      {/* Filtres actifs sous forme de pills — visible sur mobile */}
      {aDesFiltres && (
        <div className="lg:hidden flex flex-wrap gap-2 mb-4">
          {params.recherche && (
            <span className="bg-turquoise/10 text-turquoise text-xs font-medium px-3 py-1.5 rounded-full">
              🔍 {params.recherche}
            </span>
          )}
          {params.categorie && (
            <span className="bg-primary/20 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full">
              📦 {categories.find(c => c.slug === params.categorie)?.nom}
            </span>
          )}
          {params.ville && (
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
              📍 {params.ville}
            </span>
          )}
          {params.typePrix && (
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
              💰 {params.typePrix}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-6">

        {/* Sidebar filtres — desktop uniquement */}
        <aside className="hidden lg:block w-72 shrink-0">
          <Suspense fallback={<div className="bg-white rounded-2xl h-96 animate-pulse" />}>
            <SearchFilter categories={categories} />
          </Suspense>
        </aside>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">

          {/* Barre résultats */}
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-gray-500">
            <span>
              <strong className="text-gray-900">{total}</strong> annonce{total > 1 ? "s" : ""}
              {aDesFiltres && <span className="text-turquoise ml-1">(filtrées)</span>}
            </span>
            <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs sm:text-sm outline-none focus:border-turquoise bg-white">
              <option>Plus récentes</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>

          {annonces.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-base font-medium text-gray-600">Aucune annonce trouvée</p>
              <p className="text-sm mt-1 text-turquoise">
                Tsy misy filazana — Essayez d&apos;autres filtres
              </p>
            </div>
          ) : (
            <>
              {/* Grille — 2 colonnes sur mobile (360px+), 3 sur md */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {annonces.map((annonce) => (
                  <AnnonceCard key={annonce.id} annonce={annonce as any} isFavorite={annonce.isFavorite} />
                ))}
              </div>

              <Suspense>
                <Pagination pageActuelle={page} totalPages={pages} />
              </Suspense>
            </>
          )}
        </div>
      </div>

      {/* Drawer filtres mobile */}
      <Suspense>
        <FiltresDrawer categories={categories} totalAnnonces={total} />
      </Suspense>
    </div>
  )
}