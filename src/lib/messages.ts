// lib/messages.ts

import { prisma } from "./prisma"
import type { Prisma } from "@prisma/client"

export type MessageWithDetails = Prisma.MessageGetPayload<{
  include: {
    envoyeur: {
      select: {
        id: true
        name: true
      }
    }
    destinataire: {
      select: {
        id: true
        name: true
      }
    }
    annonce: {
      select: {
        id: true
        titre: true
        prix: true
        typesPrix: true
        localisation: true
        images: {
          select: {
            id: true
            url: true
          },
          take: 1
        }
        categorie: {
          select: {
            nom: true
            slug: true
          }
        }
      }
    }
  }
}>

export type Conversation = {
  annonceId: string
  annonce: {
    id: string
    titre: string
    prix: number | null
    typesPrix: string
    localisation: string
    images: Array<{
      id: string
      url: string
    }>
    categorie: {
      nom: string
      slug: string
    }
  }
  otherUser: {
    id: string
    name: string | null
  }
  lastMessage: MessageWithDetails
  unreadCount: number
}

export async function getMessagesForUser(userId: string): Promise<{ conversations: Conversation[], totalConversations: number }> {
  try {
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
            prix: true,
            typesPrix: true,
            localisation: true,
            images: {
              select: {
                id: true,
                url: true,
              },
              take: 1
            },
            categorie: {
              select: {
                nom: true,
                slug: true,
              }
            }
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

    return {
      conversations: Array.from(conversations.values()),
      totalConversations: conversations.size
    }

  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return { conversations: [], totalConversations: 0 }
  }
}
