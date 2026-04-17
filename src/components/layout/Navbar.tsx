"use client"

import Link from "next/link"
import { useState, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Menu, X, Plus, MapPin, Heart, ChevronDown, MessageCircle } from "lucide-react"
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { sanitizeSearchQuery } from "@/lib/search";

export function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitizedQuery = sanitizeSearchQuery(searchQuery);
    router.push(`/recherche?q=${sanitizedQuery}`);
  };

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
        <form onSubmit={handleSubmit} className="hidden md:flex flex-1 items-center border-2 border-gray-200 focus-within:border-turquoise rounded-xl overflow-hidden transition-colors">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une annonce… Karohy eto"
            className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
          />
          <button type="submit" className="bg-turquoise hover:bg-turquoise-hover transition-colors px-4 py-2.5">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

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

              <Link
                href="/messages"
                className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-turquoise hover:bg-turquoise/10 transition-colors"
                title="Mes messages"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                href="/favoris"
                className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Mes favoris"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setMenuOuvert(!menuOuvert)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-turquoise font-medium transition-colors md:hidden"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-white text-sm font-bold">
                    {session.user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="relative md:block hidden">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-turquoise font-medium transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-white text-sm font-bold">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href={`/profile/${session.user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Mon Profil
                    </Link>
                    <Link
                      href="/mes-annonces"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Mes Annonces
                    </Link>
                    <Link
                      href="/mes-achats"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Mes Achats
                    </Link>
                    <Link
                      href="/favoris"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Mes Favoris
                    </Link>
                    <Link
                      href="/parametres"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Paramètres
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>

          ) : (
            // Non connecté
            <div className="flex items-center gap-3">
              <Link href="/auth/inscription" className="text-sm text-turquoise hover:text-turquoise-hover font-medium transition-colors">
                S'inscrire
              </Link>
              <Link href="/auth/connexion" className="text-sm text-gray-600 hover:text-turquoise font-medium transition-colors">
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden border-t-2 border-primary bg-white px-4 py-4 flex flex-col gap-3">
          {session && (
            <Link
              href="/annonces/creer"
              className="btn-primary text-sm text-center"
              onClick={() => setMenuOuvert(false)}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Déposer une annonce
            </Link>
          )}
          
          <form onSubmit={handleSubmit} className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher… Karohy"
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-turquoise px-4 py-2.5">
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>

          {session ? (
            <>
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center gap-3 text-sm text-gray-700 py-2"
                onClick={() => setMenuOuvert(false)}
              >
                <div className="w-6 h-6 rounded-full bg-turquoise flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                Mon Profil
              </Link>
              <Link
                href="/mes-annonces"
                className="flex items-center gap-3 text-sm text-gray-700 py-2"
                onClick={() => setMenuOuvert(false)}
              >
                <Plus className="w-4 h-4 text-gray-400" />
                Mes Annonces
              </Link>
              <Link
                href="/mes-achats"
                className="flex items-center gap-3 text-sm text-gray-700 py-2"
                onClick={() => setMenuOuvert(false)}
              >
                <div className="w-4 h-4 text-gray-400" />
                Mes Achats
              </Link>
              <Link 
                href="/messages" 
                onClick={() => setMenuOuvert(false)}
                className="flex items-center gap-3 text-sm text-gray-700 py-2"
              >
                <MessageCircle className="w-4 h-4 text-gray-400" /> 
                Mes messages
              </Link>
              <Link 
                href="/favoris" 
                onClick={() => setMenuOuvert(false)}
                className="flex items-center gap-3 text-sm text-gray-700 py-2"
              >
                <Heart className="w-4 h-4 text-gray-400" /> 
                Mes favoris
              </Link>
              <Link
                href="/parametres"
                className="flex items-center gap-3 text-sm text-gray-700 py-2"
                onClick={() => setMenuOuvert(false)}
              >
                <div className="w-4 h-4 text-gray-400" />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMenuOuvert(false);
                }}
                className="flex items-center gap-3 text-sm text-gray-700 py-2 w-full text-left"
              >
                <div className="w-4 h-4 text-gray-400" />
                Déconnexion
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/inscription"
                className="text-sm text-center text-turquoise block"
                onClick={() => setMenuOuvert(false)}
              >
                S'inscrire
              </Link>
              <Link
                href="/auth/connexion"
                className="text-sm text-center text-gray-600 block"
                onClick={() => setMenuOuvert(false)}
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}