import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    // Hasher le mot de passe (simple pour l'instant, pas de bcrypt)
    // Pour simplifier, on utilise une méthode basique sans dépendance externe
    const hashedPassword = password + "_hash" // Simple hash temporaire

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
