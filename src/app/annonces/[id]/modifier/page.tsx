import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAnnonceById } from "@/lib/annonces"
import { EditAnnonceForm } from "@/components/annonces/EditAnnonceForm"

type Props = { params: Promise<{ id: string }> }

export default async function EditAnnoncePage({ params }: Props) {
  const { id } = await params
  const [annonce, session] = await Promise.all([
    getAnnonceById(id),
    getServerSession(authOptions)
  ])

  if (!annonce) notFound()
  if (!session?.user?.id) redirect("/auth/connexion")
  if (annonce.user.id !== session.user.id) redirect("/annonces")

  return (
    <div className="max-w-lg mx-auto px-3 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Modifier l'annonce
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Hanova ny filazana - Madagascar
        </p>
      </div>

      <EditAnnonceForm annonce={annonce} />
    </div>
  )
}
