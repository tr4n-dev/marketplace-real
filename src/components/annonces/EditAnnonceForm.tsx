"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AnnonceDetail } from "@/lib/annonces"

interface EditAnnonceFormProps {
  annonce: AnnonceDetail
}

export function EditAnnonceForm({ annonce }: EditAnnonceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    titre: annonce.titre,
    description: annonce.description,
    prix: annonce.prix || "",
    typesPrix: annonce.typesPrix,
    localisation: annonce.localisation,
    codePostal: annonce.codePostal || "",
    statut: annonce.statut,
  })

  const VILLES = [
    "Antananarivo", "Toamasina", "Mahajanga",
    "Fianarantsoa", "Toliara", "Antsiranana",
    "Antsirabe", "Ambositra", "Morondava",
  ]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
    if (name === "prix") {
      setFormData(prev => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value) || 0,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleTypesPrixChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      typesPrix: value,
      prix: (value === "GRATUIT" || value === "ECHANGE") ? "" : prev.prix,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/annonces/${annonce.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la mise à jour")
      }

      alert("Annonce mise à jour avec succès")
      router.push(`/annonces/${annonce.id}`)
      router.refresh()
    } catch (error) {
      console.error("Erreur:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de la mise à jour")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Titre & Description */}
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
            value={formData.titre}
            onChange={handleInputChange}
            placeholder="Ex: iPhone 14 Pro 256Go - Excellent état"
            maxLength={100}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            placeholder="Décrivez votre article en détail : état, caractéristiques, raison de la vente..."
            maxLength={3000}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            required
          />
        </div>
      </section>

      {/* Prix */}
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
              onClick={() => handleTypesPrixChange(opt.valeur)}
              className={`text-sm py-2.5 px-3 rounded-xl border-2 font-medium transition-all ${
                formData.typesPrix === opt.valeur
                  ? "border-turquoise bg-turquoise text-white"
                  : "border-gray-200 text-gray-600 hover:border-turquoise"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Champ prix */}
        {formData.typesPrix !== "GRATUIT" && formData.typesPrix !== "ECHANGE" && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Prix (Ariary)
            </label>
            <div className="relative">
              <input
                name="prix"
                type="number"
                value={formData.prix}
                onChange={handleInputChange}
                min="0"
                placeholder="Ex: 750000"
                className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                Ar
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Localisation */}
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
            value={formData.localisation}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            required
          >
            <option value="">Choisir une ville</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Code postal <span className="text-gray-400 font-normal normal-case">(optionnel)</span>
          </label>
          <input
            name="codePostal"
            type="text"
            value={formData.codePostal}
            onChange={handleInputChange}
            placeholder="Ex: 101"
            maxLength={10}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
      </section>

      {/* Statut */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">
          Statut <span className="text-gray-400 font-normal text-sm">/ Satitra</span>
        </h2>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Statut de l&apos;annonce
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-200 focus:border-turquoise rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="VENDUE">Vendue</option>
            <option value="EXPIREE">Expirée</option>
          </select>
        </div>
      </section>

      {/* Bouton submit */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border-2 border-gray-200 text-gray-600 py-4 rounded-2xl text-base font-bold hover:border-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-turquoise py-4 rounded-2xl text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Mise à jour en cours...
            </>
          ) : (
            "Mettre à jour l'annonce"
          )}
        </button>
      </div>
    </form>
  )
}
