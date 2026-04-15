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

    // ================= EMPLOI =================
    {
      titre: "Développeur Web Junior - Antananarivo",
      description: "Recherche développeur React/Next.js. Connaissance de TypeScript requise. Salaire: 400000 Ar/mois + avantages.",
      prix: 400000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 250,
    },
    {
      titre: "Comptable confirmé - Cabinet Tana",
      description: "Expérience 3+ ans requise. Maîtrise Sage/SAP. Rémunération attractive selon profil.",
      prix: 600000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 180,
    },
    {
      titre: "Agent commercial - Produits locaux",
      description: "Mission: développer clientèle PME. Commission attractive. Permis B indispensable.",
      prix: 350000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 140,
    },
    {
      titre: "Professeur particulier - Anglais/Français",
      description: "Cours soutien scolaire tous niveaux. Horaires flexibles. Bon niveau linguistique requis.",
      prix: 150000,
      typesPrix: TypePrix.FIXE,
      localisation: "Fianarantsoa",
      codePostal: "301",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 95,
    },
    {
      titre: "Chauffeur VSL - Société transport",
      description: "Permis B + 2 ans d'expérience. Connaissance voies Tana. Disponibilité immédiate.",
      prix: 280000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 160,
    },
    {
      titre: "Secrétaire bilingue - Hôtel Mahajanga",
      description: "Français/Anglais courants. Master Office. Expérience hôtellerie appréciée.",
      prix: 320000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 120,
    },
    {
      titre: "Technicien maintenance informatique",
      description: "Installation réseau, dépannage hardware/software. Déplacements sur Tana et environs.",
      prix: 380000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 200,
    },
    {
      titre: "Guide touristique - Nosy Be",
      description: "Multilingue (français/anglais/italien). Connaissance parfaite sites touristiques. Saisonnier.",
      prix: 450000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Nosy Be",
      codePostal: "207",
      categorieId: await getCat("emploi"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 110,
    },

    // ================= LOISIRS =================
    {
      titre: "Guitare acoustique Yamaha F310",
      description: "Presque neuve, avec housse et métronome. Parfait pour débutant.",
      prix: 250000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 85,
    },
    {
      titre: "Surfboard 7'0\" - Nosy Be",
      description: "Planche en bon état, idéale vagues débutants. Livraison possible sur côte.",
      prix: 180000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Nosy Be",
      codePostal: "207",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 70,
    },
    {
      titre: "Console PlayStation 4 + jeux",
      description: "Manettes, 15 jeux variés. État impeccable. Vente cause passage PS5.",
      prix: 650000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 190,
    },
    {
      titre: "Vélo de montagne 21 vitesses",
      description: "Cadre aluminium, freins à disque. Entretenu régulièrement.",
      prix: 320000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antsirabe",
      codePostal: "110",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 95,
    },
    {
      titre: "Appareil photo Nikon D3500",
      description: "Objectif 18-55mm + sacoche. Parfait pour photographie voyage Madagascar.",
      prix: 850000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 140,
    },
    {
      titre: "Tente de camping 4 personnes",
      description: "Imperméable, double toit. Utilisée 2 fois seulement. Idéale parc nationaux.",
      prix: 150000,
      typesPrix: TypePrix.FIXE,
      localisation: "Fianarantsoa",
      codePostal: "301",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 60,
    },
    {
      titre: "Table de ping-pong pliante",
      description: "Intérieur/extérieur. Filet et raquettes inclus. Dimensions réglementaires.",
      prix: 280000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 45,
    },
    {
      titre: "Collection BD Tintin + Astérix",
      description: "25 albums complets, bon état. Parfait collectionneur ou jeunes lecteurs.",
      prix: 120000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("loisirs"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 55,
    },

    // ================= MAISON & JARDIN =================
    {
      titre: "Canne à pêche télescopique",
      description: "3.60m, carbone, moulinet inclus. Parfait pêche lagune et rivière.",
      prix: 95000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Mahajanga",
      codePostal: "401",
      categorieId: await getCat("maison-jardin"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 40,
    },
    {
      titre: "Kit irrigation goutte-à-goutte",
      description: "50m de tuyaux, 100 goutteurs. Idéal potager tropical.",
      prix: 75000,
      typesPrix: TypePrix.FIXE,
      localisation: "Toamasina",
      codePostal: "501",
      categorieId: await getCat("maison-jardin"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 35,
    },
    {
      titre: "Mobilier jardin - Table et 4 chaises",
      description: "Résine tressée, aluminium. Protection UV. Livraison possible Tana.",
      prix: 320000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("maison-jardin"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 80,
    },
    {
      titre: "Outils jardinage complet",
      description: "Bêche, râteau, arrosoir, sécateur. Bois et métal de qualité.",
      prix: 65000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antsirabe",
      codePostal: "110",
      categorieId: await getCat("maison-jardin"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 25,
    },
    {
      titre: "Barbecue charbon mobile",
      description: "Roulettes, grille 60x40cm. Parfait soirées d'été malgaches.",
      prix: 180000,
      typesPrix: TypePrix.NEGOCIABLE,
      localisation: "Fianarantsoa",
      codePostal: "301",
      categorieId: await getCat("maison-jardin"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 50,
    },
    {
      titre: "Plantes aromatiques en pots",
      description: "Basilic, menthe, romarin, thym. Bio, culture locale.",
      prix: 45000,
      typesPrix: TypePrix.FIXE,
      localisation: "Antananarivo",
      codePostal: "101",
      categorieId: await getCat("maison-jardin"),
      userId: user.id,
      statut: StatutAnnonce.ACTIVE,
      vues: 30,
    },
  ];

  // Create annonces first
  const createdAnnonces = [];
  for (const annonce of annonces) {
    const createdAnnonce = await prisma.annonce.create({ data: annonce });
    createdAnnonces.push(createdAnnonce);
  }

  // Create images for each annonce with placeholder Cloudinary data
  const images = [
    // Véhicules images
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776265738/toyota-hilux_as31sr.jpg", publicId: "toyota-hilux_as31sr", ordre: 0, annonceIndex: 0 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776265737/moto-cross_xojdtd.jpg", publicId: "moto-cross_xojdtd", ordre: 0, annonceIndex: 3 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776266479/taxi-bajaj_ilajx1.jpg", publicId: "taxi-bajaj_ilajx1", ordre: 0, annonceIndex: 2 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776265738/yamaha-scooter_r3frj3.jpg", publicId: "yamaha-scooter_r3frj3", ordre: 0, annonceIndex: 1 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776265738/peugeot-206_xtgwa4.jpg", publicId: "peugeot-206_xtgwa4", ordre: 0, annonceIndex: 4 },
    
    // Immobilier images - no dmyseachc URLs, will be created without images
    
    // Multimédia images
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271588/samsung-21_fzhgxp.jpg", publicId: "samsung-21_fzhgxp", ordre: 0, annonceIndex: 10 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271590/tv-led_pdmh82.jpg", publicId: "tv-led_pdmh82", ordre: 0, annonceIndex: 12 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271587/powerbank-solaire_ddqmhe.jpg", publicId: "powerbank-solaire_ddqmhe", ordre: 0, annonceIndex: 13 },
    
    // Mode images
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271586/nike-shoes_klptsf.jpg", publicId: "nike-shoes_klptsf", ordre: 0, annonceIndex: 15 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271587/robe-malgache_umsdqi.jpg", publicId: "robe-malgache_umsdqi", ordre: 0, annonceIndex: 16 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271588/sac-artisanal_tuxu0h.jpg", publicId: "sac-artisanal_tuxu0h", ordre: 0, annonceIndex: 18 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271589/t-shirts-lot_tss6je.jpg", publicId: "t-shirts-lot_tss6je", ordre: 0, annonceIndex: 19 },
    
    // Loisirs images
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271586/guitare-yamaha_h2m18c.jpg", publicId: "guitare-yamaha_h2m18c", ordre: 0, annonceIndex: 32 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271589/surfboard_hw9kfp.jpg", publicId: "surfboard_hw9kfp", ordre: 0, annonceIndex: 33 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271587/playstation-4_rzfg3d.jpg", publicId: "playstation-4_rzfg3d", ordre: 0, annonceIndex: 34 },
    { url: "https://res.cloudinary.com/dmyseachc/image/upload/v1776271590/appareil-photo_caxqqk.jpg", publicId: "appareil-photo_caxqqk", ordre: 0, annonceIndex: 36 },
    
 
  ];

  // Then create images for each annonce
  for (const imageData of images) {
    const annonce = createdAnnonces[imageData.annonceIndex];
    if (annonce) {
      await prisma.image.create({
        data: {
          url: imageData.url,
          publicId: imageData.publicId,
          ordre: imageData.ordre,
          annonceId: annonce.id,
        },
      });
    }
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