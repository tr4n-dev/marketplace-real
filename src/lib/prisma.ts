// src/lib/prisma.ts
import "dotenv/config"
import { PrismaClient } from "../../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// POURQUOI ce pattern "singleton" ?
// En développement, Next.js recharge le code à chaque modification (HMR).
// Sans ce pattern, chaque rechargement créerait une NOUVELLE connexion à la DB,
// et on se retrouverait vite avec des centaines de connexions ouvertes → crash.
// Avec ce pattern, on réutilise toujours la même instance.

// On déclare une variable globale pour stocker l'instance (hors du module)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

// Si une instance existe déjà (en dev), on la réutilise. Sinon on en crée une.
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma