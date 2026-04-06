// src/app/auth/erreur/page.tsx
import Link from "next/link"

export default function ErreurAuthPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-16 text-center">
      <p className="text-4xl mb-4">😕</p>
      <h1 className="text-lg font-bold text-gray-900 mb-2">Erreur de connexion</h1>
      <p className="text-sm text-gray-400 mb-6">
        Une erreur est survenue lors de la connexion.
      </p>
      <Link href="/auth/connexion" className="btn-turquoise px-6 py-3 rounded-xl text-sm">
        Réessayer
      </Link>
    </div>
  )
}