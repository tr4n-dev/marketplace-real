// prisma/seed.ts
// Ce script remplit la DB avec des données initiales (catégories, sous-catégories)
// On l'exécute une seule fois avec : npx prisma db seed

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding la base de données...");

  // "upsert" = update si existe, insert sinon → idempotent (safe à relancer)
  const categories = [
    {
      nom: "Véhicules",
      slug: "vehicules",
      icone: "Car",
      couleur: "#3B82F6",
      sousCategories: ["Voitures", "Motos", "Camions", "Bateaux", "Caravaning"],
    },
    {
      nom: "Immobilier",
      slug: "immobilier",
      icone: "Home",
      couleur: "#10B981",
      sousCategories: ["Ventes maisons", "Ventes appartements", "Locations", "Colocations", "Bureaux & Commerces"],
    },
    {
      nom: "Multimédia",
      slug: "multimedia",
      icone: "Monitor",
      couleur: "#8B5CF6",
      sousCategories: ["Informatique", "Téléphonie", "Image & Son", "Jeux vidéo", "Photo"],
    },
    {
      nom: "Mode",
      slug: "mode",
      icone: "Shirt",
      couleur: "#EC4899",
      sousCategories: ["Vêtements", "Chaussures", "Accessoires", "Montres & Bijoux"],
    },
    {
      nom: "Maison & Jardin",
      slug: "maison-jardin",
      icone: "Sofa",
      couleur: "#F59E0B",
      sousCategories: ["Meubles", "Électroménager", "Décoration", "Bricolage", "Jardinage"],
    },
    {
      nom: "Loisirs",
      slug: "loisirs",
      icone: "Gamepad2",
      couleur: "#EF4444",
      sousCategories: ["Sport", "Vélos", "Livres", "Musique", "Collection"],
    },
    {
      nom: "Emploi",
      slug: "emploi",
      icone: "Briefcase",
      couleur: "#06B6D4",
      sousCategories: ["Offres d'emploi", "Formations professionnelles"],
    },
    {
      nom: "Services",
      slug: "services",
      icone: "Wrench",
      couleur: "#84CC16",
      sousCategories: ["Cours particuliers", "Services à la personne", "Artisans & Travaux"],
    },
  ];

  for (const cat of categories) {
    // On crée la catégorie (ou on la met à jour si elle existe déjà)
    const categorie = await prisma.categorie.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        nom: cat.nom,
        slug: cat.slug,
        icone: cat.icone,
        couleur: cat.couleur,
      },
    });

    // On crée les sous-catégories liées
    for (const scNom of cat.sousCategories) {
      const slug = scNom
        .toLowerCase()
        .normalize("NFD")                        // Décompose les accents
        .replace(/[\u0300-\u036f]/g, "")         // Supprime les accents
        .replace(/[^a-z0-9]+/g, "-")             // Remplace les espaces/spéciaux par "-"
        .replace(/^-+|-+$/g, "");                // Supprime les tirets en début/fin

      await prisma.sousCategorie.upsert({
        where: {
          // Prisma ne peut faire un upsert que sur un champ @unique
          // Comme slug seul n'est pas unique globalement, on cherche manuellement
          id: (await prisma.sousCategorie.findFirst({
            where: { slug, categorieId: categorie.id },
          }))?.id ?? "inexistant",
        },
        update: {},
        create: {
          nom: scNom,
          slug,
          categorieId: categorie.id,
        },
      });
    }

    console.log(`✅ Catégorie créée : ${cat.nom}`);
  }

  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Jean Dupont",
      password: "hashed_password", // on hashe proprement à l'étape auth
    },
  })

  const catVehicules = await prisma.categorie.findUnique({ where: { slug: "vehicules" } })
  const catMultimedia = await prisma.categorie.findUnique({ where: { slug: "multimedia" } })
  const catImmobilier = await prisma.categorie.findUnique({ where: { slug: "immobilier" } })
  const catMode = await prisma.categorie.findUnique({ where: { slug: "mode" } })

  const scVoitures = await prisma.sousCategorie.findFirst({ where: { slug: "voitures" } })
  const scInformatique = await prisma.sousCategorie.findFirst({ where: { slug: "informatique" } })
  const scAppartements = await prisma.sousCategorie.findFirst({ where: { slug: "ventes-appartements" } })
  const scVetements = await prisma.sousCategorie.findFirst({ where: { slug: "vetements" } })
  const annonces = [
    {
      titre: "iPhone 14 Pro 256Go - Excellent état",
      description: "Vendu avec boîte d'origine, chargeur et protection écran. Aucune rayure. Batterie à 98%.",
      prix: 750,
      typesPrix: "FIXE" as const,
      localisation: "Paris",
      codePostal: "75011",
      categorieId: catMultimedia!.id,
      sousCategorieId: scInformatique!.id,
      userId: user.id,
      statut: "ACTIVE" as const,
      vues: 142,
    },
    {
      titre: "Renault Clio 5 - 2021 - 35 000 km",
      description: "Première main, carnet d'entretien complet, contrôle technique ok. Climatisation, GPS intégré.",
      prix: 14500,
      typesPrix: "NEGOCIABLE" as const,
      localisation: "Lyon",
      codePostal: "69003",
      categorieId: catVehicules!.id,
      sousCategorieId: scVoitures!.id,
      userId: user.id,
      statut: "ACTIVE" as const,
      vues: 89,
    },
    {
      titre: "Appartement T3 - 65m² - Centre ville",
      description: "Beau T3 lumineux, double vitrage, parquet, cuisine équipée. Charges comprises. Disponible de suite.",
      prix: 850,
      typesPrix: "FIXE" as const,
      localisation: "Bordeaux",
      codePostal: "33000",
      categorieId: catImmobilier!.id,
      sousCategorieId: scAppartements!.id,
      userId: user.id,
      statut: "ACTIVE" as const,
      vues: 310,
    },
    {
      titre: "Veste The North Face - Taille L - Neuve",
      description: "Achetée il y a 3 mois, portée 2 fois. Taille L, coloris noir. Avec étiquette.",
      prix: 120,
      typesPrix: "FIXE" as const,
      localisation: "Marseille",
      codePostal: "13001",
      categorieId: catMode!.id,
      sousCategorieId: scVetements!.id,
      userId: user.id,
      statut: "ACTIVE" as const,
      vues: 57,
    },
    {
      titre: "MacBook Pro M2 - 14 pouces - 16Go RAM",
      description: "Acheté en janvier 2023. Sous garantie Apple jusqu'en janvier 2024. Très bon état général.",
      prix: 1800,
      typesPrix: "NEGOCIABLE" as const,
      localisation: "Paris",
      codePostal: "75008",
      categorieId: catMultimedia!.id,
      sousCategorieId: scInformatique!.id,
      userId: user.id,
      statut: "ACTIVE" as const,
      vues: 203,
    },
    {
      titre: "Canapé 3 places - IKEA KIVIK - Gris",
      description: "En parfait état, housse lavable, peu utilisé. À venir chercher sur place. Non démontable.",
      prix: 0,
      typesPrix: "GRATUIT" as const,
      localisation: "Nantes",
      codePostal: "44000",
      categorieId: (await prisma.categorie.findUnique({ where: { slug: "maison-jardin" } }))!.id,
      sousCategorieId: (await prisma.sousCategorie.findFirst({ where: { slug: "meubles" } }))!.id,
      userId: user.id,
      statut: "ACTIVE" as const,
      vues: 78,
    },
  ]

  for (const annonce of annonces) {
    await prisma.annonce.upsert({
      where: {
        // upsert basé sur titre + userId pour éviter les doublons au re-seed
        id: (await prisma.annonce.findFirst({
          where: { titre: annonce.titre, userId: user.id },
        }))?.id ?? "inexistant",
      },
      update: {},
      create: annonce,
    })
  }
  
  console.log("🎉 Seeding terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });