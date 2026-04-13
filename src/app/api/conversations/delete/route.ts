import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const annonceId = searchParams.get("annonceId")
    const otherUserId = searchParams.get("otherUserId")

    if (!annonceId || !otherUserId) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur fait partie de cette conversation
    const existingMessage = await prisma.message.findFirst({
      where: {
        annonceId,
        OR: [
          {
            AND: [
              { envoyeurId: session.user.id },
              { destinataireId: otherUserId }
            ]
          },
          {
            AND: [
              { envoyeurId: otherUserId },
              { destinataireId: session.user.id }
            ]
          }
        ]
      }
    })

    if (!existingMessage) {
      return NextResponse.json(
        { error: "Conversation non trouvée" },
        { status: 404 }
      )
    }

    // Supprimer tous les messages de cette conversation
    const deleteResult = await prisma.message.deleteMany({
      where: {
        annonceId,
        OR: [
          {
            AND: [
              { envoyeurId: session.user.id },
              { destinataireId: otherUserId }
            ]
          },
          {
            AND: [
              { envoyeurId: otherUserId },
              { destinataireId: session.user.id }
            ]
          }
        ]
      }
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count
    })

  } catch (error) {
    console.error("Erreur lors de la suppression de la conversation:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
