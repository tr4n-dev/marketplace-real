// src/app/annonces/[id]/page.tsx
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Eye, Clock, Phone, MessageCircle, Heart, ChevronLeft, Shield } from "lucide-react"
import { getAnnonceById, incrementerVues } from "@/lib/annonces"
import type { Metadata } from "next"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const annonce = await getAnnonceById(id)
  if (!annonce) return { title: "Annonce introuvable" }
  return {
    title: annonce.titre,
    description: annonce.description.slice(0, 160),
  }
}

type Props = { params: Promise<{ id: string }> }

function formatPrix(prix: number | null, typePrix: string): string {
  if (typePrix === "GRATUIT") return "Maimbo / Gratuit"
  if (typePrix === "ECHANGE") return "Fifanakalozana / Échange"
  if (!prix) return "Prix non renseigné"
  return new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(prix)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(date))
}

function formatDateRelative(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffH = Math.floor(diffMs / 3600000)
  const diffJ = Math.floor(diffH / 24)
  if (diffH < 1) return "À l'instant"
  if (diffH < 24) return `Il y a ${diffH}h`
  if (diffJ < 7) return `Il y a ${diffJ} jour${diffJ > 1 ? "s" : ""}`
  return formatDate(date)
}

export default async function AnnonceDetailPage({ params }: Props) {
  const { id } = await params
  const annonce = await getAnnonceById(id)
  if (!annonce) notFound()

  void incrementerVues(id)

  const estGratuit = annonce.typesPrix === "GRATUIT"
  const prixFormate = formatPrix(annonce.prix, annonce.typesPrix)

  return (
    <div className="max-w-lg mx-auto px-3 py-4 sm:py-6">

      {/* Retour */}
      <Link
        href="/annonces"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-turquoise mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour
      </Link>

      {/* ── Image(s) ── */}
      <div className="rounded-2xl overflow-hidden bg-gray-100 mb-4">
        {annonce.images.length === 0 ? (
          <div className="aspect-[4/3] flex flex-col items-center justify-center text-gray-300">
            <span className="text-6xl mb-2">📷</span>
            <span className="text-sm">Pas de photo</span>
          </div>
        ) : (
          <div className="space-y-1.5 p-1.5">
            {/* Image principale */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={annonce.images[0].url}
                alt={annonce.titre}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
            {/* Miniatures */}
            {annonce.images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5">
                {annonce.images.slice(1, 5).map((img, i) => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={img.url}
                      alt={`photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                    {/* Overlay "+N" sur la dernière miniature si plus de 5 images */}
                    {i === 3 && annonce.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                        +{annonce.images.length - 5}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Corps principal — tout s'enchaîne sans blocs séparés ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 pt-5 pb-4 space-y-4">

          {/* Badges catégorie */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-turquoise/10 text-turquoise text-xs font-semibold px-3 py-1 rounded-full">
              {annonce.categorie.nom}
            </span>
            {annonce.sousCategorie && (
              <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                {annonce.sousCategorie.nom}
              </span>
            )}
            {annonce.typesPrix === "NEGOCIABLE" && (
              <span className="bg-primary/20 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                Négociable
              </span>
            )}
          </div>

          {/* Titre */}
          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            {annonce.titre}
          </h1>

          {/* Prix */}
          <p className={`text-2xl font-bold ${estGratuit ? "text-turquoise" : "text-gray-900"}`}>
            {prixFormate}
          </p>

          {/* Méta : lieu + date + vues */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-turquoise shrink-0" />
              {annonce.localisation}{annonce.codePostal && ` (${annonce.codePostal})`}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {formatDateRelative(annonce.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 shrink-0" />
              {annonce.vues} vue{annonce.vues > 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Séparateur coloré ── */}
          <div className="h-px bg-gradient-to-r from-primary via-turquoise to-transparent" />

          {/* ── Vendeur + CTA ── */}
          <div className="flex items-center gap-3">
            {/* Avatar initiale */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-turquoise to-primary flex items-center justify-center text-white font-bold text-base shrink-0">
              {annonce.user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">
                {annonce.user.name ?? "Vendeur"}
              </p>
              <p className="text-xs text-gray-400">
                Membre depuis {formatDate(annonce.user.createdAt)}
              </p>
            </div>
            {/* Favori */}
            <button className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors">
              <Heart className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Boutons contact */}
          <div className="grid grid-cols-2 gap-2">
            {annonce.user.phone ? (
              <a
                href={`tel:${annonce.user.phone}`}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-gray-900 font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                Appeler
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 text-sm py-3 rounded-xl cursor-not-allowed"
              >
                <Phone className="w-4 h-4" />
                Pas de tél.
              </button>
            )}
            <button className="flex items-center justify-center gap-2 btn-turquoise text-sm py-3 rounded-xl">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>

          {/* ── Séparateur ── */}
          <div className="h-px bg-gray-100" />

          {/* ── Description ── */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Description <span className="text-turquoise normal-case tracking-normal font-normal">/ Famaritana</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {annonce.description}
            </p>
          </div>

          {/* ── Séparateur ── */}
          <div className="h-px bg-gray-100" />

          {/* ── Conseils sécurité ── */}
          <div className="flex gap-3 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Conseils de sécurité / Torohevitra</p>
              <p>• Ne payez jamais avant de voir l&apos;article</p>
              <p>• Privilégiez les lieux publics pour la rencontre</p>
              <p>• Méfiez-vous des prix trop bas — Mitandrema ny vidiny ambany</p>
            </div>
          </div>

        </div>

        {/* ── Fil d'Ariane en pied de card ── */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-turquoise transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/annonces" className="hover:text-turquoise transition-colors">Annonces</Link>
          <span>/</span>
          <Link href={`/annonces?categorie=${annonce.categorie.slug}`} className="hover:text-turquoise transition-colors">
            {annonce.categorie.nom}
          </Link>
          <span>/</span>
          <span className="text-gray-500 truncate max-w-[140px]">{annonce.titre}</span>
        </div>
      </div>

    </div>
  )
}