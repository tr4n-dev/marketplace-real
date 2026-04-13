import Link from "next/link"
import { ChevronLeft, Mail, Lock, User } from "lucide-react"

export default function InscriptionPage() {
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
          <h1 className="text-lg font-bold text-gray-900">Créer un compte</h1>
          <p className="text-sm text-gray-400">Hampiditra — Rejoignez Tsena pour commencer</p>
        </div>

        {/* Formulaire */}
        <form className="p-6 space-y-4" action="/api/auth/register" method="POST">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                placeholder="Votre nom"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
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
                name="password"
                required
                minLength={1}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-turquoise focus:border-transparent"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-turquoise hover:bg-turquoise-hover text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Créer mon compte
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
          <a
            href="/api/auth/signin/facebook"
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuer avec Facebook
          </a>
        </div>

        {/* Lien vers connexion */}
        <div className="px-6 pb-6 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link
              href="/auth/connexion"
              className="text-turquoise hover:text-turquoise-hover font-semibold transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
