// src/app/auth/connexion/page.tsx
"use client"

import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, Suspense } from "react"
import Link from "next/link"
import { ChevronLeft, Mail, Lock } from "lucide-react"

function ConnexionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // "callbackUrl" = l'URL vers laquelle rediriger après connexion
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const erreurUrl = searchParams.get("error")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [credentialsLoading, setCredentialsLoading] = useState(false)

  const erreurs: Record<string, string> = {
    OAuthAccountNotLinked: "Cet email est déjà utilisé avec un autre compte",
    OAuthCallbackError: "Erreur lors de la connexion Facebook",
    CredentialsSignin: "Email ou mot de passe incorrect",
    Default: "Une erreur est survenue",
  }

  const handleFacebook = async () => {
    setLoading(true)
    // "signIn" redirige automatiquement vers Facebook
    // puis revient sur callbackUrl après connexion
    await signIn("facebook", { callbackUrl })
  }

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setCredentialsLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      // Rediriger vers la page d'erreur avec le bon code
      router.push(`/auth/connexion?error=${result.error}`)
    } else if (result?.ok) {
      // Rediriger vers la page demandée
      router.push(callbackUrl)
    }

    setCredentialsLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto px-3 py-16">
      {/* Retour */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-turquoise mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour à l'accueil
      </Link>

      {/* Carte principale */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Logo */}
        <div className="text-center space-y-1 p-6 border-b border-gray-100">
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

        {/* Formulaire email/mot de passe */}
        <form onSubmit={handleCredentials} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          {/* Erreur */}
          {erreurUrl && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {erreurs[erreurUrl] ?? erreurs.Default}
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={credentialsLoading}
            className="w-full bg-turquoise hover:bg-turquoise-hover text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {credentialsLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Séparateur */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Connexion Facebook */}
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
        </div>

        {/* Lien vers inscription */}
        <div className="px-6 pb-6 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              href="/auth/inscription"
              className="text-turquoise hover:text-turquoise-hover font-semibold transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
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