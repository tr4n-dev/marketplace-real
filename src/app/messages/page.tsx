import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ChevronLeft, MessageCircle, Trash2, MapPin, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { getMessagesForUser, type Conversation } from "@/lib/messages"
import { DeleteConversationButton } from "@/components/messages/DeleteConversationButton"

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

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto px-3 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour voir vos messages.</p>
          <Link
            href="/auth/connexion"
            className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  const { conversations } = await getMessagesForUser(session.user.id)

  return (
    <div className="max-w-4xl mx-auto px-3 py-16">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-turquoise mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes messages</h1>
        <p className="text-gray-600">
          {conversations.length === 0 
            ? "Vous n'avez aucune conversation pour le moment."
            : `${conversations.length} conversation${conversations.length > 1 ? 's' : ''} en cours`
          }
        </p>
      </div>

      {/* Liste des conversations */}
      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Aucun message</h2>
          <p className="text-gray-600 mb-6">
            Les personnes qui vous contacteront apparaîtront ici.
          </p>
          <Link
            href="/annonces"
            className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Parcourir les annonces
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation: Conversation) => (
            <div
              key={`${conversation.annonceId}_${conversation.otherUser.id}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-turquoise transition-colors"
            >
              {/* Annonce info section */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex gap-3">
                  {/* Annonce image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {conversation.annonce.images && conversation.annonce.images.length > 0 ? (
                      <img
                        src={conversation.annonce.images[0].url}
                        alt={conversation.annonce.titre}
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
                        {conversation.annonce.titre}
                      </h3>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-turquoise text-sm">
                          {formatPrix(conversation.annonce.prix, conversation.annonce.typesPrix)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {conversation.annonce.categorie && (
                        <span className="bg-turquoise/10 text-turquoise px-2 py-1 rounded-full text-xs font-medium">
                          {conversation.annonce.categorie.nom}
                        </span>
                      )}
                      {conversation.annonce.localisation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">{conversation.annonce.localisation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Conversation section */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={`/conversations/${conversation.annonceId}/${conversation.otherUser.id}`}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-turquoise to-primary flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {conversation.otherUser.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {conversation.otherUser.name ?? "Utilisateur anonyme"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {conversation.unreadCount} non lu{conversation.unreadCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{new Date(conversation.lastMessage.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="w-4 h-4 text-gray-400 shrink-0" />
                      <p className="text-gray-600 truncate">
                        {conversation.lastMessage.contenu.slice(0, 80)}{conversation.lastMessage.contenu.length > 80 ? '...' : ''}
                      </p>
                    </div>
                  </Link>
                  
                  <DeleteConversationButton
                    annonceId={conversation.annonceId}
                    otherUserId={conversation.otherUser.id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
