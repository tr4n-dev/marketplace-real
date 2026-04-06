// src/types/next-auth.d.ts
// Ce fichier étend les types de NextAuth pour ajouter
// les champs personnalisés qu'on a ajoutés dans les callbacks

import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string          // On ajoute l'id du user
    } & DefaultSession["user"]  // On garde name, email, image
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}