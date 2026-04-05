// src/lib/prisma.ts

// On importe le type PrismaClient généré par Prisma
import { PrismaClient } from "@prisma/client";

// POURQUOI ce pattern "singleton" ?
// En développement, Next.js recharge le code à chaque modification (HMR).
// Sans ce pattern, chaque rechargement créerait une NOUVELLE connexion à la DB,
// et on se retrouverait vite avec des centaines de connexions ouvertes → crash.
// Avec ce pattern, on réutilise toujours la même instance.

// On déclare une variable globale pour stocker l'instance (hors du module)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Si une instance existe déjà (en dev), on la réutilise. Sinon on en crée une.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // En dev, affiche toutes les requêtes SQL dans le terminal
  });

// En production, on ne stocke pas dans globalThis (pas besoin, pas de HMR)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;