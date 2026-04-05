import Link from "next/link"
import { AnnonceCard } from "@/components/annonces/AnnonceCard"
import { getAnnoncesRecentes, getCategoriesAvecNombre } from "@/lib/annonces"
import { Search, TrendingUp, Shield, MapPin } from "lucide-react"

export default async function HomePage() {
  const [annonces, categories] = await Promise.all([
    getAnnoncesRecentes(8),
    getCategoriesAvecNombre(),
  ])

  return (
    <div className="space-y-12">

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Déco géométrique inspirée des motifs malgaches */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-turquoise rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1 text-primary text-sm font-medium mb-4">
            🇲🇬 N°1 des petites annonces à Madagascar
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Achetez et vendez
            <span className="text-primary"> près de chez vous</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Vidio sy avy — Des milliers d&apos;annonces partout à Madagascar
          </p>

          {/* Barre de recherche hero */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Que recherchez-vous ? — Inona no karohinao ?"
                className="flex-1 px-3 py-3.5 text-sm outline-none"
              />
            </div>
            <div className="flex items-center bg-white rounded-xl px-3 gap-1 border border-gray-100">
              <MapPin className="w-4 h-4 text-turquoise shrink-0" />
              <select className="text-sm outline-none py-3.5 bg-transparent text-gray-700 cursor-pointer">
                <option>Toute Madagascar</option>
                <option>Antananarivo</option>
                <option>Toamasina</option>
                <option>Mahajanga</option>
                <option>Fianarantsoa</option>
                <option>Toliara</option>
                <option>Antsiranana</option>
              </select>
            </div>
            <button className="btn-turquoise px-6 rounded-xl">
              Rechercher
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <span><strong className="text-primary">10 000+</strong> annonces</span>
            <span><strong className="text-turquoise">6</strong> provinces</span>
            <span><strong className="text-primary">Gratuit</strong> à publier</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* ── Catégories ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Toutes les catégories
              <span className="block text-sm font-normal text-gray-400 mt-0.5">
                Sokajy rehetra
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/annonces?categorie=${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-3 bg-white rounded-xl border-2 border-gray-100 hover:border-primary hover:shadow-sm transition-all text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: cat.couleur ?? "#0ABFBC", opacity: 0.9 }}
                >
                  {iconeEmoji(cat.icone)}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">
                  {cat.nom}
                </span>
                <span className="text-[11px] text-turquoise font-medium">
                  {cat._count.annonces} annonce{cat._count.annonces > 1 ? "s" : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Annonces récentes ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Annonces récentes
              <span className="block text-sm font-normal text-gray-400 mt-0.5">
                Filazana vaovao
              </span>
            </h2>
            <Link
              href="/annonces"
              className="text-sm text-turquoise hover:text-turquoise-hover font-semibold transition-colors"
            >
              Voir tout →
            </Link>
          </div>

          {annonces.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🛒</p>
              <p>Aucune annonce pour le moment</p>
              <p className="text-sm mt-1 text-turquoise">Azo atao ny mametraka filazana voalohany</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {annonces.map((annonce) => (
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          )}
        </section>

        {/* ── Pourquoi nous choisir ── */}
        <section className="bg-gradient-to-r from-turquoise/10 to-primary/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
            Pourquoi Tsena ? — Nahoana Tsena ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6 text-turquoise" />,
                titre: "Sécurisé",
                sousTitre: "Vonjy",
                desc: "Annonces vérifiées, transactions sécurisées",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-primary" />,
                titre: "Gratuit",
                sousTitre: "Maimbo",
                desc: "Publiez vos annonces sans frais",
              },
              {
                icon: <MapPin className="w-6 h-6 text-foret" />,
                titre: "Local",
                sousTitre: "Eny an-toerana",
                desc: "Trouvez des annonces près de chez vous",
              },
            ].map((item) => (
              <div key={item.titre} className="flex flex-col items-center text-center gap-3 bg-white rounded-xl p-5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.titre}</p>
                  <p className="text-xs text-turquoise mb-1">{item.sousTitre}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

function iconeEmoji(icone: string | null): string {
  const map: Record<string, string> = {
    Car: "🚗",
    Home: "🏠",
    Monitor: "💻",
    Shirt: "👕",
    Sofa: "🛋️",
    Gamepad2: "🎮",
    Briefcase: "💼",
    Wrench: "🔧",
  }
  return icone ? (map[icone] ?? "📦") : "📦"
}