
import { AnnonceCard } from "@/components/annonces/AnnonceCard"
import { Heart } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { getFavorites } from "@/lib/favorites"

export const metadata: Metadata = { title: "Mes favoris" }

export default async function FavoritesPage() {
  
  const res =  await getFavorites();
  const annonces = res.favorites || [];
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="w-6 h-6 text-red-400" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Mes favoris
            <span className="text-gray-400 font-normal text-sm ml-2">/ Ny tiako</span>
          </h1>
          <p className="text-sm text-gray-400">{annonces.length} annonce{annonces.length > 1 ? "s" : ""} sauvegardée{annonces.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {annonces.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-600">Aucun favori pour le moment</p>
          <p className="text-sm text-turquoise mt-1">Tsy misy tiako — Sauvegardez des annonces</p>
          <Link href="/annonces" className="btn-turquoise inline-block mt-4 px-6 py-2.5 rounded-xl text-sm">
            Parcourir les annonces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {annonces.map((a: any) => (
            <AnnonceCard key={a.id} annonce={a.annonce} />
          ))}
        </div>
      )}
    </div>
  )
}