// src/components/annonces/FormulaireAnnonce.tsx
"use client"

import { useActionState, useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { creerAnnonce, type EtatAction } from "@/lib/actions/annonces"
import { ImageUploader, type ImageUploaded } from "./ImagesUploader"

type Categorie = {
  id: string
  nom: string
}

type Props = {
  categories: Categorie[]
}

// Composant réutilisable pour afficher les erreurs d'un champ
function ErreurChamp({ erreurs }: { erreurs?: string[] }) {
  if (!erreurs?.length) return null
  return (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {erreurs[0]}
    </p>
  )
}

export function FormulaireAnnonce({ categories }: Props) {
  // "useActionState" est le hook React 19 pour gérer l'état d'une Server Action
  // Il remplace "useFormState" de React 18
  // Retourne : [étatActuel, actionAvecÉtat, isPending]
  const [etat, action, isPending] = useActionState<EtatAction, FormData>(
    creerAnnonce,
    null
  )

  // État local pour les champs contrôlés
  const [categorieId, setCategorieId] = useState("")
  const [typesPrix, setTypesPrix] = useState("FIXE")
  const [images, setImages] = useState<ImageUploaded[]>([])

  const VILLES = [
    "Antananarivo", "Toamasina", "Mahajanga",
    "Fianarantsoa", "Toliara", "Antsiranana",
    "Antsirabe", "Ambositra", "Morondava",
  ]

  return (
    <form action={action} className="space-y-6">

      {/* Erreur globale */}
      {etat?.erreurGlobale && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {etat.erreurGlobale}
        </div>
      )}

      {/* ── Photos ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div>
          <h2 className="font-semibold text-gray-900">
            Photos <span className="text-gray-400 font-normal text-sm">/ Sary</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Maximum 4 photos. La première sera l&apos;image principale.</p>
        </div>
        <ImageUploader onChange={setImages} max={4} />
        {/* Champ caché pour passer les images à la Server Action */}
        <input type="hidden" name="images" value={JSON.stringify(images)} />
        <ErreurChamp erreurs={etat?.erreurs?.images} />
      </section>

      {/* ── Titre & Description ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">
          L&apos;annonce <span className="text-gray-400 font-normal text-sm">/ Ny filazana</span>
        </h2>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Titre *
          </label>
          <input
            name="titre"
            type="text"
            placeholder="Ex: iPhone 14 Pro 256Go - Excellent état"
            maxLength={100}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          />
          <ErreurChamp erreurs={etat?.erreurs?.titre} />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            rows={5}
            placeholder="Décrivez votre article en détail : état, caractéristiques, raison de la vente..."
            maxLength={3000}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
          />
          <ErreurChamp erreurs={etat?.erreurs?.description} />
        </div>
      </section>

      {/* ── Catégorie ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">
          Catégorie <span className="text-gray-400 font-normal text-sm">/ Sokajy</span>
        </h2>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Catégorie *
          </label>
          <select
            name="categorieId"
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
          <ErreurChamp erreurs={etat?.erreurs?.categorieId} />
        </div>
       
      </section>

      {/* ── Prix ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">
          Prix <span className="text-gray-400 font-normal text-sm">/ Vidiny</span>
        </h2>

        {/* Type de prix */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { valeur: "FIXE", label: "Prix fixe" },
            { valeur: "NEGOCIABLE", label: "Négociable" },
            { valeur: "GRATUIT", label: "Gratuit / Maimbo" },
            { valeur: "ECHANGE", label: "Échange" },
          ].map((opt) => (
            <button
              key={opt.valeur}
              type="button"
              onClick={() => setTypesPrix(opt.valeur)}
              className={`text-sm py-2.5 px-3 rounded-xl border-2 font-medium transition-all ${
                typesPrix === opt.valeur
                  ? "border-turquoise bg-turquoise text-white"
                  : "border-gray-200 text-gray-600 hover:border-turquoise"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="typesPrix" value={typesPrix} />

        {/* Champ prix — masqué si GRATUIT ou ECHANGE */}
        {typesPrix !== "GRATUIT" && typesPrix !== "ECHANGE" && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Prix (Ariary)
            </label>
            <div className="relative">
              <input
                name="prix"
                type="number"
                min="0"
                placeholder="Ex: 750000"
                className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                Ar
              </span>
            </div>
            <ErreurChamp erreurs={etat?.erreurs?.prix} />
          </div>
        )}
      </section>

      {/* ── Localisation ── */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">
          Localisation <span className="text-gray-400 font-normal text-sm">/ Toerana</span>
        </h2>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Ville *
          </label>
          <select
            name="localisation"
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
          >
            <option value="">Choisir une ville</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <ErreurChamp erreurs={etat?.erreurs?.localisation} />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Code postal <span className="text-gray-400 font-normal normal-case">(optionnel)</span>
          </label>
          <input
            name="codePostal"
            type="text"
            placeholder="Ex: 101"
            maxLength={10}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
      </section>

      {/* ── Bouton submit ── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-turquoise py-4 rounded-2xl text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Publication en cours…
          </>
        ) : (
          "Publier l'annonce — Mamoaka filazana"
        )}
      </button>

    </form>
  )
}