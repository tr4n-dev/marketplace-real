import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const annonceId = searchParams.get("annonceId")
    const autreUserId = searchParams.get("autreUserId")

    if (!annonceId || !autreUserId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
    }

    // Vérifier que l'annonce existe
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
      select: { userId: true }
    })

    if (!annonce) {
      return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 })
    }

    // Vérifier que l'utilisateur actuel est soit le vendeur, soit l'acheteur potentiel
    // (pas besoin de cette vérification stricte, on veut juste récupérer les messages entre ces deux utilisateurs)

    const messages = await prisma.message.findMany({
      where: {
        annonceId,
        OR: [
          {
            AND: [
              { envoyeurId: session.user.id },
              { destinataireId: autreUserId }
            ]
          },
          {
            AND: [
              { envoyeurId: autreUserId },
              { destinataireId: session.user.id }
            ]
          }
        ]
      },
      include: {
        envoyeur: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Erreur GET /api/messages:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { contenu, annonceId, destinataireId } = body

    if (!contenu || !annonceId || !destinataireId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    // Vérifier que l'annonce existe
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
      select: { userId: true, statut: true }
    })

    if (!annonce) {
      return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 })
    }

    if (annonce.statut !== "ACTIVE") {
      return NextResponse.json({ error: "Annonce non active" }, { status: 400 })
    }

    // Vérifier que l'utilisateur ne s'envoie pas de message à lui-même
    if (session.user.id === destinataireId) {
      return NextResponse.json({ error: "Impossible d'envoyer un message à soi-même" }, { status: 400 })
    }

    // Vérifier que le destinataire est soit le vendeur, soit un autre utilisateur ayant déjà contacté
    if (annonce.userId !== destinataireId && annonce.userId !== session.user.id) {
      return NextResponse.json({ error: "Destinataire non valide" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        contenu,
        annonceId,
        envoyeurId: session.user.id,
        destinataireId
      },
      include: {
        envoyeur: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Erreur POST /api/messages:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
