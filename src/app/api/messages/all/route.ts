import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Récupérer tous les messages envoyés et reçus
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { envoyeurId: userId },
          { destinataireId: userId }
        ]
      },
      include: {
        envoyeur: {
          select: {
            id: true,
            name: true,
          }
        },
        destinataire: {
          select: {
            id: true,
            name: true,
          }
        },
        annonce: {
          select: {
            id: true,
            titre: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Grouper par conversation (annonce + autre utilisateur)
    const conversations = new Map()
    
    messages.forEach(message => {
      const otherUserId = message.envoyeurId === userId ? message.destinataireId : message.envoyeurId
      const conversationKey = `${message.annonceId}_${otherUserId}`
      
      if (!conversations.has(conversationKey)) {
        conversations.set(conversationKey, {
          annonceId: message.annonceId,
          annonce: message.annonce,
          otherUser: message.envoyeurId === userId ? message.destinataire : message.envoyeur,
          lastMessage: message,
          unreadCount: 0
        })
      }
      
      const conversation = conversations.get(conversationKey)
      
      // Compter les messages non lus
      if (message.destinataireId === userId && !message.lu) {
        conversation.unreadCount++
      }
      
      // Garder le dernier message
      if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
        conversation.lastMessage = message
      }
    })

    return NextResponse.json({
      conversations: Array.from(conversations.values()),
      totalConversations: conversations.size
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
