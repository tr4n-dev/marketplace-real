// On importe uniquement les types dont on a besoin depuis Prisma
// Ça nous donne l'autocomplétion et le typage fort partout
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma"
import type { Prisma } from "@prisma/client"

export async function getFavorites() {

	const session = await getServerSession(authOptions)
 
  if (!session?.user?.id) {
    return { erreurGlobale: "Vous devez être connecté pour publier une annonce" }
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      annonce: {
				include: {
					images: true
				}
			},
    },
  });

  return { favorites };
}
// ─────────────────────────────────────────────
// TYPES EXPORTÉS
// ─────────────────────────────────────────────

// "Prisma.AnnonceGetPayload" génère automatiquement le type TypeScript
// qui correspond exactement à ce que retourne la requête Prisma ci-dessous.
// C'est bien mieux que d'écrire le type à la main : si le schéma change,
// le type se met à jour automatiquement.
export type AnnonceCard = Prisma.AnnonceGetPayload<{
  include: {
    images: { where: { ordre: 0 }; take: 1 }  // Seulement l'image principale
    categorie: true
    user: { select: { name: true; image: true } }
  }
}>

export type AnnonceDetail = Prisma.AnnonceGetPayload<{
  include: {
    images: true           // Toutes les images
    categorie: true
    user: {
      select: {
        id: true
        name: true
        image: true
        createdAt: true
        phone: true
      }
    }
  }
}>

// ─────────────────────────────────────────────
// REQUÊTES
// ─────────────────────────────────────────────

// Récupère le détail complet d'une annonce par son ID
// Retourne "null" si l'annonce n'existe pas (on gèrera le 404 dans la page)
export async function getAnnonceById(id: string): Promise<AnnonceDetail | null> {
  return prisma.annonce.findUnique({
    where: { id },
    include: {
      images: true,
      categorie: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          phone: true,
        },
      },
    },
  }) as any;
}

// Incrémente le compteur de vues d'une annonce
// On utilise "update" avec un incrément atomique pour éviter les race conditions
// (si deux personnes ouvrent l'annonce en même temps, les deux vues sont comptées)
export async function incrementerVues(id: string) {
  return prisma.annonce.update({
    where: { id },
    data: {
      vues: { increment: 1 }, // UPDATE annonces SET vues = vues + 1 WHERE id = ?
    },
  })
}