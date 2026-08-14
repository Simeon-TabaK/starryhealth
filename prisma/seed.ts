import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, SubscriptionStatus, SubscriptionPlan } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Starry Health database...");

  // Clean existing data
  await prisma.userProductPrice.deleteMany();
  await prisma.carouselItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.product.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash("password123", 10);
  const userPasswordHash = await bcrypt.hash("password123", 10);

  // 1. Super Admin
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin Oqata",
      email: "admin@starryhealth.com",
      username: "admin",
      password: adminPasswordHash,
      slug: "admin",
      role: Role.SUPER_ADMIN,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      primaryColor: "#0f766e",
      bio: "Administration Centrale Starry Health & Oqata Network Marketing.",
      contactPhone: "+243 810 000 000",
      contactEmail: "contact@starryhealth.com",
      whatsapp: "+243810000000",
    },
  });

  // 2. Member User (Independent Seller with Active Subscription)
  const userJean = await prisma.user.create({
    data: {
      name: "Jean Dupont",
      email: "jean.dupont@starryhealth.com",
      username: "jean",
      password: userPasswordHash,
      slug: "jean_dupont",
      role: Role.USER,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      primaryColor: "#0284c7", // Sky blue custom primary color
      bio: "Distributeur Indépendant Agréé Oqata / Starry Health. Expert en nutrition et produits de santé naturelle.",
      contactPhone: "+243 990 123 456",
      contactEmail: "jean.dupont@oqata-partner.com",
      whatsapp: "+243990123456",
      subscriptions: {
        create: {
          plan: SubscriptionPlan.PRO,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      },
    },
  });

  // 3. Products
  const prod1 = await prisma.product.create({
    data: {
      name: "Starry Vitality Plus",
      description: "Formule naturelle hautement concentrée en antioxydants, multivitamines et minéraux essentiels pour revitaliser l'organisme.",
      defaultPrice: 45.0,
      images: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
      category: "Compléments Alimentaires",
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: "Starry Detox Bio Cleanse",
      description: "Solution détoxifiante 100% bio pour purifier le foie, favoriser la digestion et restaurer la clarté intestinale.",
      defaultPrice: 38.0,
      images: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80",
      category: "Détox & Pureté",
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: "Starry Omega Shield 3-6-9",
      description: "Huile de poisson sauvage de qualité supérieure pure et purifiée pour soutenir le système cardiovasculaire et la concentration.",
      defaultPrice: 52.0,
      images: "https://images.unsplash.com/photo-1550572017-edf7928d10c8?auto=format&fit=crop&w=800&q=80",
      category: "Santé Cardiovasculaire",
    },
  });

  const prod4 = await prisma.product.create({
    data: {
      name: "Starry Immune Booster",
      description: "Synergie de Vitamine C liposomale, Zinc et Extrait d'Échinacée bio pour renforcer les défenses immunitaires naturelles.",
      defaultPrice: 40.0,
      images: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      category: "Système Immunitaire",
    },
  });

  // 4. Custom User Product Prices for Jean Dupont (Active Subscription)
  await prisma.userProductPrice.createMany({
    data: [
      { userId: userJean.id, productId: prod1.id, customPrice: 39.99 },
      { userId: userJean.id, productId: prod2.id, customPrice: 32.50 },
    ],
  });

  // 5. Global Carousel Items (userId: null)
  await prisma.carouselItem.createMany({
    data: [
      {
        userId: null,
        title: "Votre Santé, Notre Mission Absolue",
        subtitle: "Découvrez la gamme de produits testés et approuvés scientifiquement par Oqata & Starry Health.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
        link: "/produits",
        order: 1,
      },
      {
        userId: null,
        title: "L'Excellence du Bien-être au Quotidien",
        subtitle: "Des formules naturelles de pointe conçues pour revitaliser votre corps et fortifier votre esprit.",
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=80",
        link: "/a-propos",
        order: 2,
      },
    ],
  });

  // User Specific Carousel Item for Jean Dupont
  await prisma.carouselItem.create({
    data: {
      userId: userJean.id,
      title: "Bienvenue sur l'Espace Santé de Jean Dupont",
      subtitle: "Conseiller agréé Starry Health. Profitez de tarifs préférentiels exclusifs et d'un accompagnement personnalisé.",
      imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80",
      link: "/produits",
      order: 1,
    },
  });

  // 6. Testimonials
  // Public testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        userId: null,
        authorName: "Dr. Marie Mbenga",
        content: "Les produits Starry Health sont d'une pureté remarquable. Je les recommande régulièrement à mes patients pour booster leur tonus.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
      },
      {
        userId: null,
        authorName: "Patrick Kabanga",
        content: "Starry Vitality Plus a complètement changé ma routine matinale. Plus de fatigue chronique en milieu de journée !",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      },
    ],
  });

  // User private testimonial for Jean Dupont
  await prisma.testimonial.create({
    data: {
      userId: userJean.id,
      authorName: "Sarah Lukusa",
      content: "Jean m'a très bien conseillée sur la cure Détox Bio Cleanse. Service impeccable et livraison ultra-rapide !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  // 7. Partners
  await prisma.partner.createMany({
    data: [
      { name: "Oqata Corporate", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80", website: "https://oqata.com" },
      { name: "BioCare Labs", logoUrl: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=300&q=80", website: "#" },
      { name: "PhytoLab Europe", logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=300&q=80", website: "#" },
      { name: "Global Health Alliance", logoUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=300&q=80", website: "#" },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
