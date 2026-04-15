"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Eye } from "lucide-react"
import type { AnnonceCard } from "@/lib/annonces"
import { FavoriteIcon } from "@/components/annonces/FavoriteIcon"
import { iconeEmoji } from "@/lib/utils/icons"

function formatPrix(prix: number | null, typePrix: string): string {
  if (typePrix === "GRATUIT") return "Maimbo / Gratuit"
  if (typePrix === "ECHANGE") return "Fifanakalozana"
  if (!prix) return "Prix non renseigné"
  return new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: "MGA",      // Ariary malgache
    maximumFractionDigits: 0,
  }).format(prix)
}

function formatDateRelative(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffH = Math.floor(diffMs / 3600000)
  const diffJ = Math.floor(diffH / 24)
  if (diffH < 1) return "À l'instant"
  if (diffH < 24) return `Il y a ${diffH}h`
  if (diffJ < 7) return `Il y a ${diffJ}j`
  return new Intl.DateTimeFormat("fr-FR").format(new Date(date))
}

export function AnnonceCard({ annonce, isFavorite = false }: { annonce: AnnonceCard; isFavorite?: boolean }) {
  const imagePrincipale = annonce.images[0]
  const isFree = annonce.typesPrix === "GRATUIT"

  return (
    <Link
      href={`/annonces/${annonce.id}`}
      className="group card flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {imagePrincipale ? (
          <Image
            src={imagePrincipale.url}
            alt={annonce.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50"  style={{ backgroundColor: annonce.categorie?.couleur ?? "#0ABFBC", opacity: 0.7 }}>
            <span>{iconeEmoji(annonce.categorie?.icone)}</span>
          </div>
        )}

        {/* Badge catégorie */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full text-gray-700 border border-gray-100">
          {/* {annonce.categorie.nom} */}
        </span>

        {/* Actions (Favorite) */}
        <div className="absolute top-2 right-2 flex gap-1">
          {/* FavoriteIcon - standalone component */}

          {/* Badge gratuit */}
          {isFree && (
            <span className="bg-turquoise text-white text-xs font-bold px-2 py-1 rounded-full">
              Maimbo
            </span>
          )}
        </div>
      </div>

      {/* Contenu — plus compact sur mobile */}
      <div className="p-2 sm:p-3 flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-turquoise transition-colors leading-snug">
            {annonce.titre}
          </h3>
          <FavoriteIcon annonceId={annonce.id} initialLiked={isFavorite} />
        </div>

        <p className={`font-bold text-sm sm:text-base ${isFree ? "text-turquoise" : "text-gray-900"}`}>
          {formatPrix(annonce.prix, annonce.typesPrix)}
          {annonce.typesPrix === "NEGOCIABLE" && (
            <span className="text-xs font-normal text-gray-400 ml-1 hidden sm:inline">(nég.)</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-gray-50 text-[10px] sm:text-xs text-gray-400">
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-turquoise shrink-0" />
            <span className="truncate max-w-[60px] sm:max-w-none">{annonce.localisation}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5">
              <Eye className="w-2.5 h-2.5" />
              {annonce.vues}
            </span>
            <span className="hidden sm:inline">{formatDateRelative(annonce.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}