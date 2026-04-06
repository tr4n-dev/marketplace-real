// src/components/annonces/ImageUploader.tsx
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, GripVertical, Loader2, ImagePlus } from "lucide-react"

export type ImageUploaded = {
  url: string
  publicId: string
  ordre: number
}

type Props = {
  onChange: (images: ImageUploaded[]) => void
  max?: number
}

export function ImageUploader({ onChange, max = 4 }: Props) {
  const [images, setImages] = useState<ImageUploaded[]>([])
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploaderImage = async (fichier: File): Promise<ImageUploaded | null> => {
    const formData = new FormData()
    formData.append("fichier", fichier)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.erreur ?? "Erreur upload")
    }

    return {
      url: data.url,
      publicId: data.publicId,
      ordre: 0, // sera réassigné après
    }
  }

  const handleFichiers = async (fichiers: FileList | null) => {
    if (!fichiers || fichiers.length === 0) return
    setErreur(null)

    // Combien peut-on encore ajouter ?
    const placesRestantes = max - images.length
    if (placesRestantes === 0) {
      setErreur(`Maximum ${max} images autorisées`)
      return
    }

    // On prend seulement ce qu'on peut
    const fichiersATraiter = Array.from(fichiers).slice(0, placesRestantes)
    setLoading(true)

    try {
      // Upload en parallèle pour aller plus vite
      const resultats = await Promise.all(
        fichiersATraiter.map((f) => uploaderImage(f))
      )

      const nouvellesImages = resultats
        .filter((r): r is ImageUploaded => r !== null)
        .map((img, i) => ({
          ...img,
          ordre: images.length + i, // ordre = position dans la liste
        }))

      const listeFinale = [...images, ...nouvellesImages]
      setImages(listeFinale)
      onChange(listeFinale)
    } catch (e: unknown) {
      setErreur(e instanceof Error ? e.message : "Erreur lors de l'upload")
    } finally {
      setLoading(false)
    }
  }

  const supprimerImage = (index: number) => {
    // On supprime l'image et on réassigne les ordres
    const listeFinale = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, ordre: i }))
    setImages(listeFinale)
    onChange(listeFinale)
  }

  return (
    <div className="space-y-3">

      {/* Zone de drop / sélection */}
      {images.length < max && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFichiers(e.dataTransfer.files)
          }}
          className="border-2 border-dashed border-gray-200 hover:border-turquoise rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 text-turquoise animate-spin" />
          ) : (
            <div className="w-12 h-12 bg-turquoise/10 rounded-full flex items-center justify-center group-hover:bg-turquoise/20 transition-colors">
              <ImagePlus className="w-6 h-6 text-turquoise" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              {loading ? "Upload en cours…" : "Ajouter des photos"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG, WebP · Max 5MB · {images.length}/{max} photos
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFichiers(e.target.files)}
          />
        </div>
      )}

      {/* Message d'erreur */}
      {erreur && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" />
          {erreur}
        </p>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={img.publicId} className="relative group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={img.url}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                {/* Badge "principale" sur la 1ère image */}
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    Principale
                  </span>
                )}
              </div>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={() => supprimerImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Icône drag (visuel seulement pour l'instant) */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3.5 h-3.5 text-white drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conseil */}
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <Upload className="w-3 h-3" />
        La première photo sera l&apos;image principale de l&apos;annonce
      </p>
    </div>
  )
}