// src/app/api/upload/route.ts
// Cette route reçoit une image en FormData, l'upload sur Cloudinary
// et retourne l'URL + publicId à stocker en DB

import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configuration Cloudinary — lue depuis les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Taille max autorisée : 5MB
const MAX_SIZE = 5 * 1024 * 1024
// Types MIME autorisés
const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp"]

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const fichier = formData.get("fichier") as File | null

    // ── Validations ──
    if (!fichier) {
      return NextResponse.json({ erreur: "Aucun fichier reçu" }, { status: 400 })
    }

    if (!TYPES_AUTORISES.includes(fichier.type)) {
      return NextResponse.json(
        { erreur: "Format non supporté. Utilisez JPG, PNG ou WebP" },
        { status: 400 }
      )
    }

    if (fichier.size > MAX_SIZE) {
      return NextResponse.json(
        { erreur: "Fichier trop lourd (max 5MB)" },
        { status: 400 }
      )
    }

    // Convertit le fichier en Buffer pour l'envoyer à Cloudinary
    // File → ArrayBuffer → Buffer (format attendu par Cloudinary)
    const bytes = await fichier.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Cloudinary via une Promise
    // Cloudinary n'a pas d'API async/await native, on l'encapsule
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "tsena-madagascar",   // Dossier dans Cloudinary
              transformation: [
                { width: 1200, crop: "limit" }, // Max 1200px de large
                { quality: "auto" },             // Compression automatique
                { fetch_format: "auto" },        // WebP si supporté par le navigateur
              ],
            },
            (error, result) => {
              if (error || !result) reject(error)
              else resolve(result)
            }
          )
          .end(buffer)
      }
    )

    // On retourne uniquement ce dont on a besoin
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })

  } catch (error) {
    console.error("Erreur upload:", error)
    return NextResponse.json(
      { erreur: "Erreur serveur lors de l'upload" },
      { status: 500 }
    )
  }
}