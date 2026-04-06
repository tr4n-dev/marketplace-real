// src/app/annonces/creer/page.tsx
import { prisma } from "@/lib/prisma"
import { FormulaireAnnonce } from "@/components/annonces/FormulaireAnnonce"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Déposer une annonce",
}

export default async function CreerAnnoncePage() {
  // On récupère les catégories avec leurs sous-catégories pour le formulaire
  const categories = await prisma.categorie.findMany({
    orderBy: { nom: "asc" }
  })

  return (
    <div className="max-w-lg mx-auto px-3 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Déposer une annonce
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Mamoaka filazana — Madagascar
        </p>
      </div>
      <FormulaireAnnonce categories={categories} />
    </div>
  )
}