import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeft, MessageCircle, User, MapPin, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ChatForm } from "@/components/chat/ChatForm"

function formatPrix(prix: number | null, typePrix: string): string {
  if (typePrix === "GRATUIT") return "Gratuit"
  if (typePrix === "ECHANGE") return "Échange"
  if (!prix) return "Prix non renseigné"
  return new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(prix)
}

interface Message {
  id: string
  contenu: string
  createdAt: string
  lu: boolean
  envoyeurId: string
  destinataireId: string
  envoyeur: {
    id: string
    name: string | null
  }
  destinataire: {
    id: string
    name: string | null
  }
}

async function getConversationMessages(annonceId: string, currentUserId: string, otherUserId: string) {
  try {
    // Vérifier que l'annonce existe
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
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
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!annonce) {
      return null
    }

    // Récupérer tous les messages entre les deux utilisateurs pour cette annonce
    const messages = await prisma.message.findMany({
      where: {
        annonceId,
        OR: [
          { envoyeurId: currentUserId, destinataireId: otherUserId },
          { envoyeurId: otherUserId, destinataireId: currentUserId }
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
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Marquer les messages comme lus
    await prisma.message.updateMany({
      where: {
        annonceId,
        destinataireId: currentUserId,
        envoyeurId: otherUserId,
        lu: false
      },
      data: {
        lu: true
      }
    })

    return {
      annonce,
      messages
    }

  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error)
    return null
  }
}

async function getOtherUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true
      }
    })
    return user
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return null
  }
}

export default async function ConversationPage({ params }: { params: Promise<{ annonceId: string, otherUserId: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/connexion')
  }

  const { annonceId, otherUserId } = await params
  const currentUserId = session.user.id

  // Récupérer les données de la conversation
  const conversationData = await getConversationMessages(annonceId, currentUserId, otherUserId)
  const otherUser = await getOtherUser(otherUserId)

  if (!conversationData || !otherUser) {
    notFound()
  }

  const { annonce, messages } = conversationData

  return (
    <div className="max-w-2xl mx-auto px-3 py-16">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/messages"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-turquoise mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux messages
        </Link>
        
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Annonce info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-3">
              {/* Annonce image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {annonce.images && annonce.images.length > 0 ? (
                  <img
                    src={annonce.images[0].url}
                    alt={annonce.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              
              {/* Annonce details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                    {annonce.titre}
                  </h3>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-turquoise text-sm">
                      {formatPrix(annonce.prix, annonce.typesPrix)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {annonce.categorie && (
                    <span className="bg-turquoise/10 text-turquoise px-2 py-1 rounded-full text-xs font-medium">
                      {annonce.categorie.nom}
                    </span>
                  )}
                  {annonce.localisation && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{annonce.localisation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* User info */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turquoise to-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                {otherUser.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-gray-900 truncate">
                  {otherUser.name ?? "Utilisateur"}
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  Conversation avec {otherUser.name ?? "cet utilisateur"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun message dans cette conversation</p>
              <p className="text-sm text-gray-400 mt-2">Soyez le premier à envoyer un message!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isFromMe = message.envoyeurId === currentUserId
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isFromMe
                        ? 'bg-turquoise text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm break-words">{message.contenu}</p>
                    <p className={`text-xs mt-1 ${
                      isFromMe ? 'text-turquoise-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {!message.lu && message.destinataireId === currentUserId && (
                        <span className="ml-2">Non lu</span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-4">
          <ChatForm annonceId={annonceId} destinataireId={otherUserId} />
        </div>
      </div>
    </div>
  )
}
