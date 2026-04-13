"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { ChatDialog } from "./ChatDialog"

interface ChatDialogWrapperProps {
  annonceId: string
  annonceTitle: string
  vendeurId: string
  vendeurName: string
  currentUserId: string
  isOwner: boolean
}

export function ChatDialogWrapper({ 
  annonceId, 
  annonceTitle, 
  vendeurId, 
  vendeurName, 
  currentUserId,
  isOwner 
}: ChatDialogWrapperProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  if (isOwner) {
    return null // Don't show chat button for the owner
  }

  return (
    <>
      <button 
        onClick={() => setIsChatOpen(true)}
        className="flex items-center justify-center gap-2 btn-turquoise text-sm py-3 rounded-xl"
      >
        <MessageCircle className="w-4 h-4" />
        Message
      </button>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        annonceId={annonceId}
        annonceTitle={annonceTitle}
        vendeurId={vendeurId}
        vendeurName={vendeurName}
        currentUserId={currentUserId}
      />
    </>
  )
}
