// src/lib/validations.ts
import { z } from "zod"

export const schemaAnnonce = z.object({
  titre: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),

  description: z
    .string()
    .max(3000, "La description ne peut pas dépasser 3000 caractères")
    .optional(),

  prix: z
    .number({ invalid_type_error: "Le prix doit être un nombre" } as any)
    .min(0, "Le prix ne peut pas être négatif")
    .optional(),

  typesPrix: z.enum(["FIXE", "NEGOCIABLE", "GRATUIT", "ECHANGE"]),

  localisation: z
    .string()
    .min(2, "La ville est obligatoire")
    .optional(),

  codePostal: z.string().optional(),

  categorieId: z
    .string()
    .min(1, "La catégorie est obligatoire"),

  images: z
    .array(z.object({
      url: z.string().url(),
      publicId: z.string(),
      ordre: z.number(),
    }))
    .max(4, "Maximum 4 images"),
})

// Type TypeScript généré automatiquement depuis le schéma Zod
export type SchemaAnnonce = z.infer<typeof schemaAnnonce>