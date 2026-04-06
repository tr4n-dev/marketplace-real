// src/app/auth/connexion/page.tsx
"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"

function ConnexionContent() {
  const searchParams = useSearchParams()
  // "callbackUrl" = l'URL vers laquelle rediriger après connexion
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const erreurUrl = searchParams.get("error")
  const [loading, setLoading] = useState(false)

  const erreurs: Record<string, string> = {
    OAuthAccountNotLinked: "Cet email est déjà utilisé avec un autre compte",
    OAuthCallbackError: "Erreur lors de la connexion Facebook",
    Default: "Une erreur est survenue",
  }

  const handleFacebook = async () => {
    setLoading(true)
    // "signIn" redirige automatiquement vers Facebook
    // puis revient sur callbackUrl après connexion
    await signIn("facebook", { callbackUrl })
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">

        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex flex-col w-1 h-8 rounded overflow-hidden">
              <div className="flex-1 bg-red-600" />
              <div className="flex-1 bg-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl text-gray-900">tsena</span>
              <span className="text-[10px] text-turquoise font-medium tracking-widest uppercase">Madagascar</span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Se connecter</h1>
          <p className="text-sm text-gray-400">Miditra — Connectez-vous pour continuer</p>
        </div>

        {/* Erreur */}
        {erreurUrl && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {erreurs[erreurUrl] ?? erreurs.Default}
          </div>
        )}

        {/* Bouton Facebook */}
        <button
          onClick={handleFacebook}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            // Icône Facebook en SVG — pas besoin d'une lib externe
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )}
          Continuer avec Facebook
        </button>

        <p className="text-xs text-center text-gray-400">
          En vous connectant, vous acceptez nos{" "}
          <a href="/cgu" className="text-turquoise hover:underline">CGU</a>
          {" "}et notre{" "}
          <a href="/confidentialite" className="text-turquoise hover:underline">politique de confidentialité</a>
        </p>
      </div>
    </div>
  )
}

// Suspense obligatoire car useSearchParams est utilisé
export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionContent />
    </Suspense>
  )
}