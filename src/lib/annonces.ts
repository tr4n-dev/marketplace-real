// lib/annonces.ts

// On importe uniquement les types dont on a besoin depuis Prisma
// Ça nous donne l'autocomplétion et le typage fort partout
import { prisma } from "./prisma"
import type { Prisma } from "@prisma/client"

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
    sousCategorie: true
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

// Récupère les annonces récentes pour la page d'accueil
// "take: 8" = LIMIT 8 en SQL
export async function getAnnoncesRecentes(take = 8): Promise<AnnonceCard[]> {
  return prisma.annonce.findMany({
    where: {
      statut: "ACTIVE", // Seulement les annonces actives
    },
    orderBy: {
      createdAt: "desc", // Les plus récentes en premier
    },
    take,
    include: {
      images: {
        where: { ordre: 0 }, // Seulement l'image principale (ordre = 0)
        take: 1,
      },
      categorie: true,
      user: {
        select: {          // "select" = on choisit exactement les champs retournés
          name: true,      // On ne retourne JAMAIS le mot de passe, même hashé
          image: true,
        },
      },
    },
  })
}

// Récupère toutes les catégories avec le nombre d'annonces actives
export async function getCategoriesAvecNombre() {
  return prisma.categorie.findMany({
    orderBy: { nom: "asc" },
    include: {
      // "_count" est une fonctionnalité Prisma qui fait un COUNT() SQL automatiquement
      _count: {
        select: {
          annonces: {
            where: { statut: "ACTIVE" },
          },
        },
      },
    },
  })
}

// Récupère le détail complet d'une annonce par son ID
// Retourne "null" si l'annonce n'existe pas (on gèrera le 404 dans la page)
export async function getAnnonceById(id: string): Promise<AnnonceDetail | null> {
  return prisma.annonce.findUnique({
    where: { id },
    include: {
      images: true,
      categorie: true,
      sousCategorie: true,
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
  })
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