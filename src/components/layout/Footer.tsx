import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">

      {/* Bande de couleur en haut */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-primary to-turquoise" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex flex-col w-1 h-8 rounded overflow-hidden">
                <div className="flex-1 bg-red-600" />
                <div className="flex-1 bg-primary" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-lg">tsena</span>
                <span className="text-[10px] text-turquoise font-medium tracking-widest uppercase">Madagascar</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Le premier site de petites annonces de Madagascar.<br />
              <span className="text-turquoise">Ny voalohany amin&apos;ny filazana kely eto Madagasikara.</span>
            </p>
            <div className="mt-4 flex flex-col gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-turquoise" />
                Antananarivo, Madagascar
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-turquoise" />
                +261 20 XX XXX XX
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-turquoise" />
                contact@tsena.mg
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Le site</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Nos engagements</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Actualités</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Aide / Fanampiana</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Centre d&apos;aide</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Signaler une annonce</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">CGU</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Tsena Madagascar — Tous droits réservés</span>
          <span className="text-turquoise">Vita Malagasy 🇲🇬</span>
        </div>
      </div>
    </footer>
  )
}