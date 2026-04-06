// src/lib/auth.ts
// On sépare la config dans un fichier dédié pour pouvoir
// l'importer dans les Server Components sans importer NextAuth entier

import type { NextAuthOptions } from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  // L'adapter Prisma gère automatiquement :
  // - la création du User en DB lors du premier login
  // - la création du Account lié (provider + providerAccountId)
  // - la gestion des Sessions
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      // On demande l'email et la photo de profil à Facebook
      authorization: {
        params: {
          scope: "email,public_profile",
        },
      },
    }),
  ],

  // "jwt" stocke la session dans un cookie chiffré côté client
  // C'est plus simple et scalable que les sessions en DB
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // "jwt" est appelé à chaque création/rafraîchissement du token
    // On y ajoute l'id du user pour pouvoir l'utiliser partout
    async jwt({ token, user }) {
      // "user" n'est présent qu'à la première connexion
      if (user) {
        token.id = user.id
      }
      return token
    },

    // "session" est appelé à chaque fois qu'on appelle getServerSession()
    // On y expose l'id du user à l'application
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    // On définit nos propres pages au lieu des pages par défaut de NextAuth
    signIn: "/auth/connexion",
    error: "/auth/erreur",
  },
}