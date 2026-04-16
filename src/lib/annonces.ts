// lib/annonces.ts

// On importe uniquement les types dont on a besoin depuis Prisma
// Ça nous donne l'autocomplétion et le typage fort partout
import { prisma } from "./prisma"
import type { Prisma } from "@prisma/client"


// Type pour les filtres — correspond exactement aux search params de l'URL
export type FiltresAnnonces = {
  recherche?: string
  categorie?: string
  ville?: string
  prixMin?: number
  prixMax?: number
  typePrix?: string
  page?: number
}

const PAR_PAGE = 20


export async function getAnnonces(filtres: FiltresAnnonces = {}) {
  const { recherche, categorie, ville, prixMin, prixMax, typePrix, page = 1 } = filtres

  // On construit le "where" dynamiquement selon les filtres actifs
  // Prisma ignore les champs "undefined" automatiquement
  const where: Prisma.AnnonceWhereInput = {
    statut: "ACTIVE",

    // Recherche textuelle sur titre ET description
    // "contains" = LIKE '%...%' en SQL
    // "mode: insensitive" = insensible à la casse
    ...(recherche && {
      OR: [
        { titre: { contains: recherche, mode: "insensitive" } },
        { description: { contains: recherche, mode: "insensitive" } },
      ],
    }),

    // Filtre par slug de catégorie
    ...(categorie && {
      categorie: { slug: categorie },
    }),

    // Filtre par ville
    ...(ville && {
      localisation: { contains: ville, mode: "insensitive" },
    }),
    

    // Filtre par fourchette de prix
    ...(prixMin !== undefined || prixMax !== undefined ? {
      prix: {
        ...(prixMin !== undefined && { gte: prixMin }), // gte = >=
        ...(prixMax !== undefined && { lte: prixMax }), // lte = <=
      },
    } : {}),

    // Filtre par type de prix (FIXE, NEGOCIABLE, GRATUIT, ECHANGE)
    ...(typePrix && {
      typesPrix: typePrix as "FIXE" | "NEGOCIABLE" | "GRATUIT" | "ECHANGE",
    }),
  }

  // On lance les deux requêtes en parallèle :
  // 1. Les annonces de la page courante
  // 2. Le nombre total (pour la pagination)
  const [annonces, total] = await Promise.all([
    prisma.annonce.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAR_PAGE,  // OFFSET en SQL
      take: PAR_PAGE,                // LIMIT en SQL
      include: {
        images: { where: { ordre: 0 }, take: 1 },
        categorie: true,
        user: { select: { name: true, image: true } },
      },
    }),
    prisma.annonce.count({ where }),
  ])

  return {
    annonces,
    total,
    pages: Math.ceil(total / PAR_PAGE),
    page,
  }
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
    favorites: true
  }
}>

// ─────────────────────────────────────────────
// REQUÊTES
// ─────────────────────────────────────────────

// Récupère les annonces récentes pour la page d'accueil
// "take: 8" = LIMIT 8 en SQL
export async function getAnnoncesRecentes(take = 20): Promise<AnnonceCard[]> {
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
  }) as any;
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
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          phone: true,
        },
      },
      favorites: true
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

// Récupère toutes les annonces d'un utilisateur
export async function getAnnoncesByUser(userId: string): Promise<AnnonceCard[]> {
  return prisma.annonce.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc", // Les plus récentes en premier
    },
    include: {
      images: {
        where: { ordre: 0 }, // Seulement l'image principale (ordre = 0)
        take: 1,
      },
      categorie: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  }) as any;
}

// Récupère les annonces avec statut favori pour l'utilisateur connecté
export async function getAnnoncesWithFavorites(filtres: FiltresAnnonces = {}, userId?: string) {
  const { recherche, categorie, ville, prixMin, prixMax, typePrix, page = 1 } = filtres

  // On construit le "where" dynamiquement selon les filtres actifs
  const where: Prisma.AnnonceWhereInput = {
    statut: "ACTIVE",

    ...(recherche && {
      OR: [
        { titre: { contains: recherche, mode: "insensitive" } },
        { description: { contains: recherche, mode: "insensitive" } },
      ],
    }),

    ...(categorie && {
      categorie: { slug: categorie },
    }),

    ...(ville && {
      localisation: { contains: ville, mode: "insensitive" },
    }),

    ...(prixMin !== undefined || prixMax !== undefined ? {
      prix: {
        ...(prixMin !== undefined && { gte: prixMin }),
        ...(prixMax !== undefined && { lte: prixMax }),
      },
    } : {}),

    ...(typePrix && {
      typesPrix: typePrix as "FIXE" | "NEGOCIABLE" | "GRATUIT" | "ECHANGE",
    }),
  }

  const [annonces, total] = await Promise.all([
    prisma.annonce.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAR_PAGE,
      take: PAR_PAGE,
      include: {
        images: { where: { ordre: 0 }, take: 1 },
        categorie: true,
        user: { select: { name: true, image: true } },
        favorites: userId ? {
          where: { userId },
          select: { userId: true },
        } : false,
      },
    }),
    prisma.annonce.count({ where }),
  ])

  // Transform annonces to include isFavorite boolean
  const annoncesWithFavoriteStatus = annonces.map(annonce => ({
    ...annonce,
    isFavorite: userId ? annonce.favorites.length > 0 : false,
  }))

  return {
    annonces: annoncesWithFavoriteStatus,
    total,
    pages: Math.ceil(total / PAR_PAGE),
    page,
  }
}

export async function getAnnoncesTotalCount () {
  return await prisma.annonce.count();
}