"use client"

import { useState, useRef } from "react"
import { Send } from "lucide-react"

interface ChatFormProps {
  annonceId: string
  destinataireId: string
}

export function ChatForm({ annonceId, destinataireId }: ChatFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const contenu = formData.get('contenu') as string
    
    if (!contenu.trim()) {
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contenu,
          annonceId,
          destinataireId
        })
      })
      
      if (response.ok) {
        // Reset form and reload page to show new message
        if (formRef.current) {
          formRef.current.reset()
        }
        window.location.reload()
      } else {
        console.error('Erreur lors de l\'envoi du message')
        alert('Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'envoi du message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        name="contenu"
        placeholder="Tapez votre message..."
        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
        required
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-turquoise hover:bg-turquoise-hover disabled:opacity-60 text-white p-3 rounded-xl transition-colors"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  )
}
