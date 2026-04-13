"use client"

import { useState } from "react"
import { Trash2, X } from "lucide-react"

interface DeleteConversationButtonProps {
  annonceId: string
  otherUserId: string
}

export function DeleteConversationButton({ annonceId, otherUserId }: DeleteConversationButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(
        `/api/conversations/delete?annonceId=${annonceId}&otherUserId=${otherUserId}`,
        {
          method: 'DELETE'
        }
      )
      
      if (response.ok) {
        window.location.reload()
      } else {
        console.error('Erreur lors de la suppression de la conversation')
        alert('Erreur lors de la suppression de la conversation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression de la conversation')
    } finally {
      setIsLoading(false)
      setIsConfirming(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Supprimer la conversation</h3>
            <button
              onClick={() => setIsConfirming(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsConfirming(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Supprimer'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      title="Supprimer la conversation"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
