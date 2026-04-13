"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, User } from "lucide-react"

interface Message {
  id: string
  contenu: string
  createdAt: string
  envoyeurId: string
  destinataireId: string
  envoyeur: {
    id: string
    name: string | null
  }
}

interface InlineChatProps {
  annonceId: string
  vendeurId: string
  vendeurName: string
  currentUserId: string
}

const PRESET_MESSAGES = [
  "Bonjour, je suis intéressé(e) par cette annonce. Est-elle toujours disponible ?",
  "Quel lieu de rendez-vous proposez-vous pour la remise en main propre ?",
  "Quelles sont vos disponibilités cette semaine ?",
  "Puis-je venir voir l'article avant de finaliser l'achat ?",
  "Acceptez-vous le paiement par Mobile Money ?"
]

export function InlineChat({ 
  annonceId, 
  vendeurId, 
  vendeurName, 
  currentUserId 
}: InlineChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isExpanded) {
      loadMessages()
    }
  }, [isExpanded, annonceId])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages?annonceId=${annonceId}&autreUserId=${vendeurId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (contenu: string) => {
    if (!contenu.trim()) return

    setIsSending(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contenu: contenu.trim(),
          annonceId,
          destinataireId: vendeurId,
        }),
      })

      if (response.ok) {
        const newMsg = await response.json()
        setMessages(prev => [...prev, newMsg])
        setNewMessage("")
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de l'envoi du message")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de l'envoi du message")
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(newMessage)
  }

  const handlePresetClick = (message: string) => {
    setNewMessage(message)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turquoise to-primary flex items-center justify-center text-white font-bold text-sm">
            {vendeurName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Contacter {vendeurName}</h3>
            <p className="text-xs text-gray-500">
              {messages.length > 0 ? `${messages.length} message${messages.length > 1 ? "s" : ""}` : "Envoyer un message"}
            </p>
          </div>
        </div>
        <MessageCircle className="w-5 h-5 text-gray-600" />
      </div>

      {/* Chat Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm">Chargement des messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-12 h-12 mb-3" />
                <p className="text-sm font-medium">Commencez la conversation</p>
                <p className="text-xs mt-1">Posez vos questions sur cet article</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.envoyeurId === currentUserId
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-turquoise text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.contenu}</p>
                      <p className={`text-xs mt-1 ${isOwn ? "text-turquoise-100" : "text-gray-500"}`}>
                        {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Messages */}
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Messages rapides:</p>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {PRESET_MESSAGES.map((preset: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handlePresetClick(preset)}
                  className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  {preset.length > 30 ? preset.slice(0, 30) + "..." : preset}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent text-sm"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="p-2 bg-turquoise text-white rounded-xl hover:bg-turquoise-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
