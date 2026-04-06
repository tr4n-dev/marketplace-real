// src/app/api/auth/[...nextauth]/route.ts
// "[...nextauth]" est un "catch-all" — il capture toutes les routes
// /api/auth/signin, /api/auth/callback/facebook, /api/auth/signout, etc.
// NextAuth les gère automatiquement

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

// On exporte le même handler pour GET et POST
// GET  → /api/auth/signin (page de connexion)
// POST → /api/auth/callback/facebook (retour OAuth)
export { handler as GET, handler as POST }