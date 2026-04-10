// src/lib/actions/annonces.ts
// "use server" indique à Next.js que ce code s'exécute UNIQUEMENT sur le serveur
// On peut l'appeler directement depuis un composant client comme une fonction normale
// Next.js gère la sérialisation et le transport automatiquement
"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { revalidatePath } from "next/cache";

export interface CreateFavoriteData {
  annonceId: string;
}
export async function 

toggleFavorite(
  data: CreateFavoriteData
) {

  const session = await getServerSession(authOptions)
 
  if (!session?.user?.id) {
    return { globalErrors: "Vous devez être connecté pour adorer une annonce" }
  }
  
  const existant = await prisma.favorite.findUnique({
    where: {
      userId_annonceId: {
        userId: session.user.id,
        annonceId : data.annonceId,
      },
    },
  });
  if (existant) {
    try {
      await prisma.favorite.delete({ where: { id: existant.id } })
      revalidatePath("/favoris")
      revalidatePath(`/annonces/${data.annonceId}`)
      return { favori: false }
    } catch (error) {
      console.error("Erreur delete favori:", error)
      return { msg: "Une erreur est survenue, veuillez réessayer" }
    }
  } 
  else {
    // ── N'existe pas → on crée
    try {
      await prisma.favorite.create({
        data: {
          userId: session?.user?.id,
          annonceId: data.annonceId,
        },
      })
    } catch (error) {
      // "redirect" lance une exception, on la laisse passer
      // les autres errors sont capturées ici
      console.error("Erreur création favori:", error)
      return { msg: "Une erreur est survenue, veuillez réessayer" }
    }
    revalidatePath("/favoris")
    revalidatePath(`/annonces/${data.annonceId}`)
    return { favori: true }
  }
}