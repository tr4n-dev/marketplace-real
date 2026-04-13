import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAnnoncesByUser } from "@/lib/annonces"
import { AnnonceCard } from "@/components/annonces/AnnonceCard"
import { AnnonceActions } from "@/components/annonces/AnnonceActions"
import Link from "next/link"
import { Plus, Store } from "lucide-react"

export default async function MesAnnoncesPage() {
  const session = await getServerSession(authOptions)

  // Rediriger vers la connexion si non authentifié
  if (!session?.user?.id) {
    redirect("/auth/connexion")
  }

  // Récupérer les annonces de l'utilisateur
  const annonces = await getAnnoncesByUser(session.user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-turquoise" />
            Mes annonces
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez toutes vos annonces publiées
          </p>
        </div>
        
        <Link
          href="/annonces/nouvelle"
          className="btn-turquoise flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{annonces.length}</div>
          <div className="text-sm text-gray-600">Total annonces</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-turquoise">
            {annonces.filter(a => a.statut === "ACTIVE").length}
          </div>
          <div className="text-sm text-gray-600">Actives</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-2xl font-bold text-primary">
            {annonces.reduce((sum, a) => sum + (a.vues || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Vues totales</div>
        </div>
      </div>

      {/* Liste des annonces */}
      {annonces.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vous n'avez pas encore d'annonce
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez à vendre en publiant votre première annonce
          </p>
          <Link
            href="/annonces/creer"
            className="btn-turquoise inline-flex items-center gap-2 px-6 py-3 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Publier une annonce
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filtres par statut */}
          <div className="flex flex-wrap gap-2">
            {["Toutes", "Actives", "Vendues", "Expirées"].map((statut) => (
              <button
                key={statut}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {statut}
              </button>
            ))}
          </div>

          {/* Grille d'annonces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="relative group">
                <AnnonceCard annonce={annonce} isFavorite={true}/>
                
                {/* Badge de statut */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${annonce.statut === "ACTIVE" ? "bg-green-100 text-green-800" : ""}
                    ${annonce.statut === "VENDUE" ? "bg-blue-100 text-blue-800" : ""}
                    ${annonce.statut === "EXPIREE" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${annonce.statut === "SUPPRIMEE" ? "bg-red-100 text-red-800" : ""}
                  `}>
                    {annonce.statut === "ACTIVE" && "Active"}
                    {annonce.statut === "VENDUE" && "Vendue"}
                    {annonce.statut === "EXPIREE" && "Expirée"}
                    {annonce.statut === "SUPPRIMEE" && "Supprimée"}
                  </span>
                </div>

                {/* Actions rapides */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AnnonceActions 
                    annonceId={annonce.id} 
                    isOwner={true}
                    className="bg-white/90 backdrop-blur-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
