"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, MoreVertical } from "lucide-react"

interface AnnonceActionsProps {
  annonceId: string
  isOwner: boolean
  className?: string
}

export function AnnonceActions({ annonceId, isOwner, className }: AnnonceActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/annonces/${annonceId}/modifier`)
    setShowDropdown(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/annonces/${annonceId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la suppression")
      }

      alert("Annonce supprimée avec succès")
      router.push("/mes-annonces")
      router.refresh()
    } catch (error) {
      console.error("Erreur:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleMarkAsSold = async () => {
    try {
      const response = await fetch(`/api/annonces/${annonceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: "VENDUE" }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la mise à jour")
      }

      alert("Annonce marquée comme vendue")
      router.refresh()
      setShowDropdown(false)
    } catch (error) {
      console.error("Erreur:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de la mise à jour")
    }
  }

  if (!isOwner) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`p-2 rounded-xl hover:bg-gray-50 transition-colors ${className}`}
        aria-label="Actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-20">
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left rounded-t-xl"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            
            <button
              onClick={handleMarkAsSold}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left text-turquoise"
            >
              <div className="w-4 h-4 rounded-full bg-turquoise" />
              Marquer comme vendue
            </button>
            
            <div className="border-t border-gray-100" />
            
            <button
              onClick={() => {
                setShowDeleteDialog(true)
                setShowDropdown(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-red-50 transition-colors text-left text-red-600 rounded-b-xl"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Supprimer cette annonce ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. L'annonce et toutes ses images seront définitivement supprimées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
