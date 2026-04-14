import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type Params = {
  params: Promise<{
    id: string
  }>
}

// PATCH - Mettre à jour une annonce
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Vérifier que l'annonce appartient à l'utilisateur
  const annonceExistante = await prisma.annonce.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!annonceExistante) {
    return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 })
  }

  if (annonceExistante.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { titre, description, prix, typesPrix, localisation, codePostal, statut } = body

    // Validation basique
    if (!titre || !description || !localisation) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    const updatedAnnonce = await prisma.annonce.update({
      where: { id },
      data: {
        ...(titre !== undefined && { titre }),
        ...(description !== undefined && { description }),
        ...(prix !== undefined && { prix }),
        ...(typesPrix !== undefined && { typesPrix }),
        ...(localisation !== undefined && { localisation }),
        ...(codePostal !== undefined && { codePostal }),
        ...(statut !== undefined && { statut }),
      },
      include: {
        images: true,
        categorie: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Revalider les pages qui affichent cette annonce
    revalidatePath(`/annonces/${id}`)
    revalidatePath("/mes-annonces")

    return NextResponse.json(updatedAnnonce)
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer une annonce
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Vérifier que l'annonce appartient à l'utilisateur
  const annonceExistante = await prisma.annonce.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!annonceExistante) {
    return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 })
  }

  if (annonceExistante.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    // Supprimer l'annonce (les images seront supprimées en cascade grâce à onDelete: Cascade)
    await prisma.annonce.delete({
      where: { id },
    })

    // Revalider les pages
    revalidatePath("/mes-annonces")
    revalidatePath("/annonces")

    return NextResponse.json({ message: "Annonce supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
