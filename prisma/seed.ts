// prisma/seed.ts
// Ce script remplit la DB avec des données initiales (catégories)
// On l'exécute une seule fois avec : npx prisma db seed

import "dotenv/config"
import { PrismaClient, TypePrix, StatutAnnonce } from "../generated/prisma/client"

import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding la base de données...");

  // "upsert" = update si existe, insert sinon → idempotent (safe à relancer)
  const categories = [
    {
      nom: "Véhicules",
      slug: "vehicules",
      icone: "Car",
      couleur: "#3B82F6"
    },
    {
      nom: "Immobilier",
      slug: "immobilier",
      icone: "Home",
      couleur: "#10B981"
    },
    {
      nom: "Multimédia",
      slug: "multimedia",
      icone: "Monitor",
      couleur: "#8B5CF6"
    },
    {
      nom: "Mode",
      slug: "mode",
      icone: "Shirt",
      couleur: "#EC4899"
    },
    {
      nom: "Maison & Jardin",
      slug: "maison-jardin",
      icone: "Sofa",
      couleur: "#F59E0B"
    },
    {
      nom: "Loisirs",
      slug: "loisirs",
      icone: "Gamepad2",
      couleur: "#EF4444"
    },
    {
      nom: "Emploi",
      slug: "emploi",
      icone: "Briefcase",
      couleur: "#06B6D4"
    },
    {
      nom: "Services",
      slug: "services",
      icone: "Wrench",
      couleur: "#84CC16"
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

    console.log(`✅ Catégorie créée : ${cat.nom}`);
  }

  const user = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "admin",
      password: "hashed_password", // on hashe proprement à l'étape auth
    },
  })

  const getCat = async (slug: string) =>
    (await prisma.categorie.findUnique({ where: { slug } }))!.id


  const annonces = [
    // ================= VEHICULES =================
    {
      titre: "Toyota Hilux 2015 - Diesel - Bon état",
      description: "4x4 robuste, idéal pour routes difficiles. Papier en règle.",
      prix: 65000000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("vehicules"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 120,
    },
    {
      titre: "Scooter Yamaha 125cc",
      description: "Parfait pour circulation en ville. Consomme peu.",
      prix: 3500000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("vehicules"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 80,
    },
    {
      titre: "Taxi Bajaj en activité",
      description: "Déjà en service avec clientèle régulière.",
      prix: 9000000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("vehicules"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 60,
    },
    {
      titre: "Moto cross 150cc",
      description: "Idéale pour piste et loisirs.",
      prix: 4200000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antsirabe",
      codePostal: "110",
      categorieId: await getCat("vehicules"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 45,
    },
    {
      titre: "Peugeot 206 essence",
      description: "Voiture économique, bonne pour usage quotidien.",
      prix: 12000000,
      typesPrix: TypePrix.FIXE,
      localisation: "Fianarantsoa",
      codePostal: "301",
      categorieId: await getCat("vehicules"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 70,
    },
  
    // ================= IMMOBILIER =================
    {
      titre: "Maison à louer Ivandry",
      description: "Villa sécurisée, proche écoles internationales.",
      prix: 2500000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("immobilier"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 200,
    },
    {
      titre: "Terrain 500m² Ambohidratrimo",
      description: "Terrain plat avec accès route.",
      prix: 30000000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "105",
      categorieId: await getCat("immobilier"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 150,
    },
    {
      titre: "Studio meublé centre-ville",
      description: "Idéal étudiant ou expatrié.",
      prix: 800000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("immobilier"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 90,
    },
    {
      titre: "Maison bord de mer",
      description: "Vue mer, parfaite pour vacances.",
      prix: 120000000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Nosy Be",
      codePostal: "207",
      categorieId: await getCat("immobilier"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 130,
    },
    {
      titre: "Chambre à louer",
      description: "Quartier calme, accès facile transport.",
      prix: 250000,
      typesPrix: TypePrix.FIXE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("immobilier"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 55,
    },
  
    // ================= MULTIMEDIA =================
    {
      titre: "Samsung Galaxy S21",
      description: "Bon état, livré avec chargeur.",
      prix: 1800000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("multimedia"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 210,
    },
    {
      titre: "Laptop HP i5 8Go RAM",
      description: "Parfait pour travail et études.",
      prix: 2200000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("multimedia"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 160,
    },
    {
      titre: "Télévision LED 42 pouces",
      description: "Image nette, peu utilisé.",
      prix: 900000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antsirabe",
      codePostal: "110",
      categorieId: await getCat("multimedia"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 75,
    },
    {
      titre: "Powerbank solaire",
      description: "Utile en cas de coupure d’électricité.",
      prix: 120000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toliara",
      codePostal: "601",
      categorieId: await getCat("multimedia"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 90,
    },
    {
      titre: "Routeur WiFi TP-Link",
      description: "Bonne couverture pour maison.",
      prix: 150000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("multimedia"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 50,
    },
  
    // ================= MODE =================
    {
      titre: "Chaussures Nike originales",
      description: "Pointure 42, bon état.",
      prix: 120000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("mode"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 65,
    },
    {
      titre: "Robe traditionnelle malgache",
      description: "Idéale pour cérémonie.",
      prix: 90000,
      typesPrix: TypePrix.FIXE,
      localisation: "Fianarantsoa",
      codePostal: "301",
      categorieId: await getCat("mode"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 40,
    },
    {
      titre: "Veste cuir homme",
      description: "Bonne qualité, peu portée.",
      prix: 200000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antsirabe",
      codePostal: "110",
      categorieId: await getCat("mode"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 55,
    },
    {
      titre: "Sac à main artisanal",
      description: "Fait main à Madagascar.",
      prix: 60000,
      typesPrix: TypePrix.FIXE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("mode"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 70,
    },
    {
      titre: "T-shirts lot de 5",
      description: "Divers tailles.",
      prix: 50000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("mode"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 35,
    },
  
    // ================= SERVICES =================
    {
      titre: "Réparation smartphone",
      description: "Changement écran, batterie.",
      prix: 50000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("services"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 110,
    },
    {
      titre: "Cours particuliers math",
      description: "Niveau collège et lycée.",
      prix: 30000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antsirabe",
      codePostal: "110",
      categorieId: await getCat("services"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 60,
    },
    {
      titre: "Plombier disponible",
      description: "Intervention rapide.",
      prix: 40000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("services"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 45,
    },
    {
      titre: "Création site web",
      description: "Next.js, SEO inclus.",
      prix: 800000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("services"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 95,
    },
    {
      titre: "Livraison moto express",
      description: "Courses et colis.",
      prix: 10000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("services"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 80,
    },
  ]


  for (const annonce of annonces) {
    await prisma.annonce.create({ data: annonce })
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