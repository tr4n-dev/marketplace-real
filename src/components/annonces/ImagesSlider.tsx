// src/components/annonces/ImageSlider.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageSliderProps = {
  images: { id: string; url: string }[]
  titre: string
}

export function ImageSlider({ images, titre }: ImageSliderProps) {
  const [indexActif, setIndexActif] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-300">
        <span className="text-6xl mb-2">📷</span>
        <span className="text-sm">Pas de photo</span>
      </div>
    )
  }

  const precedent = () =>
    setIndexActif((i) => (i === 0 ? images.length - 1 : i - 1))

  const suivant = () =>
    setIndexActif((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-2">

      {/* Image principale avec flèches */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
        <Image
          key={images[indexActif].id} // force le re-render pour l'animation
          src={images[indexActif].url}
          alt={`${titre} — photo ${indexActif + 1}`}
          fill
          className="object-cover"
          priority={indexActif === 0}
          sizes="(max-width: 512px) 100vw, 512px"
        />

        {/* Flèches — visibles uniquement si plusieurs images */}
        {images.length > 1 && (
          <>
            <button
              onClick={precedent}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={suivant}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Compteur */}
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {indexActif + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Miniatures cliquables */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndexActif(i)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                i === indexActif
                  ? "ring-2 ring-turquoise ring-offset-1"  // sélectionnée
                  : "opacity-60 hover:opacity-90"           // non sélectionnée
              }`}
            >
              <Image
                src={img.url}
                alt={`miniature ${i + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}