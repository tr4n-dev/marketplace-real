"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Menu, X, Plus, MapPin } from "lucide-react"
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="bg-white border-b-2 border-primary sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          {/* Bande aux couleurs du drapeau malgache */}
          <div className="flex flex-col w-1 h-8 rounded overflow-hidden">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-primary" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              tsena
            </span>
            <span className="text-[10px] text-turquoise font-medium tracking-widest uppercase">
              Madagascar
            </span>
          </div>
        </Link>

        {/* Barre de recherche */}
        <div className="hidden md:flex flex-1 items-center border-2 border-gray-200 focus-within:border-turquoise rounded-xl overflow-hidden transition-colors">
          <div className="flex items-center gap-1 px-3 text-gray-400 border-r border-gray-200">
            <MapPin className="w-4 h-4" />
            <select className="text-xs outline-none bg-transparent text-gray-600 cursor-pointer">
              <option>Toute Madagascar</option>
              <option>Antananarivo</option>
              <option>Toamasina</option>
              <option>Mahajanga</option>
              <option>Fianarantsoa</option>
              <option>Toliara</option>
              <option>Antsiranana</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Rechercher une annonce… Karohy eto"
            className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
          />
          <button className="bg-turquoise hover:bg-turquoise-hover transition-colors px-4 py-2.5">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Actions droite */}
        <div className="ml-auto flex items-center gap-3">

          {status === "loading" ? (
            // Skeleton pendant le chargement
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />

          ) : session ? (
            // Utilisateur connecté
            <>
              <Link
                href="/annonces/creer"
                className="hidden md:flex items-center gap-2 btn-primary text-sm"
              >
                <Plus className="w-4 h-4" />
                Déposer une annonce
              </Link>
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (<div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-white text-sm font-bold">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </>

          ) : (
            // Non connecté
            <Link href="/auth/connexion" className="text-sm text-gray-600 hover:text-turquoise font-medium transition-colors">
              Se connecter
            </Link>
          )}

          <button
            className="md:hidden p-1"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Menu"
          >
            {menuOuvert
              ? <X className="w-6 h-6 text-gray-700" />
              : <Menu className="w-6 h-6 text-gray-700" />
            }
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden border-t-2 border-primary bg-white px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <input
              type="text"
              placeholder="Rechercher… Karohy"
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
            <button className="bg-turquoise px-4 py-2.5">
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
          <Link
            href="/annonces/creer"
            className="btn-primary text-sm text-center"
            onClick={() => setMenuOuvert(false)}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Déposer une annonce
          </Link>
          <Link
            href="/auth/connexion"
            className="text-sm text-center text-gray-600"
            onClick={() => setMenuOuvert(false)}
          >
            Se connecter
          </Link>
        </div>
      )}
    </header>
  )
}