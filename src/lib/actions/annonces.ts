// src/lib/actions/annonces.ts
// "use server" indique à Next.js que ce code s'exécute UNIQUEMENT sur le serveur
// On peut l'appeler directement depuis un composant client comme une fonction normale
// Next.js gère la sérialisation et le transport automatiquement
"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { schemaAnnonce } from "@/lib/validations"

// Type retourné par la Server Action
// On retourne soit une erreur, soit on redirige
export type EtatAction = {
  erreurs?: Record<string, string[]>
  erreurGlobale?: string
} | null

export async function creerAnnonce(
  _etatPrecedent: EtatAction,
  formData: FormData
): Promise<EtatAction> {

  // 1. Extraire les données du FormData
  const rawData = {
    titre: formData.get("titre") as string,
    description: formData.get("description") as string,
    prix: formData.get("prix") ? Number(formData.get("prix")) : undefined,
    typesPrix: formData.get("typesPrix") as string,
    localisation: formData.get("localisation") as string,
    codePostal: formData.get("codePostal") as string || undefined,
    categorieId: formData.get("categorieId") as string,
    sousCategorieId: formData.get("sousCategorieId") as string || undefined,
    // Les images sont sérialisées en JSON dans un champ caché
    images: JSON.parse(formData.get("images") as string || "[]"),
  }

  // 2. Valider avec Zod
  const validation = schemaAnnonce.safeParse(rawData)

  if (!validation.success) {
    // "flatten()" transforme les erreurs Zod en objet plat { champ: [messages] }
    return {
      erreurs: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = validation.data

  // 3. Récupérer l'utilisateur connecté
  // Pour l'instant on utilise le user de test — on branchera la session à l'étape auth
  const user = await prisma.user.findFirst({
    where: { email: "test@test.com" },
  })

  if (!user) {
    return { erreurGlobale: "Vous devez être connecté pour publier une annonce" }
  }

  // 4. Créer l'annonce avec ses images en une seule transaction Prisma
  // "create" avec "images: { createMany }" fait tout en une seule requête SQL
  try {
    const annonce = await prisma.annonce.create({
      data: {
        titre: data.titre,
        description: data.description || "",
        prix: data.prix,
        typesPrix: data.typesPrix,
        localisation: data.localisation || "",
        codePostal: data.codePostal,
        categorieId: data.categorieId,
        userId: user.id,
        // createMany insère toutes les images en une seule requête
        images: {
          createMany: {
            data: data.images.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              ordre: img.ordre,
            })),
          },
        },
      },
    })

    // 5. Rediriger vers la page de l'annonce créée
    // "redirect" lance une exception spéciale Next.js — elle doit être hors du try/catch
    redirect(`/annonces/${annonce.id}`)

  } catch (error) {
    // "redirect" lance une exception, on la laisse passer
    // les autres erreurs sont capturées ici
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error
    console.error("Erreur création annonce:", error)
    return { erreurGlobale: "Une erreur est survenue, veuillez réessayer" }
  }
}