import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  SubscriptionStatus,
  SubscriptionPlan,
  BillingPeriod,
} from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Starry Health database with new multi-tenant and subscription schema...");

  // Clean existing data in dependency order
  await prisma.adminSuggestion.deleteMany();
  await prisma.userProductPrice.deleteMany();
  await prisma.suggestion.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customDomain.deleteMany();
  await prisma.tenantConfig.deleteMany();
  await prisma.carouselItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlanPricing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash("Pass12345", 10);
  const userPasswordHash = await bcrypt.hash("Pass12345", 10);

  // 1. Subscription Plan Pricings
  await prisma.subscriptionPlanPricing.createMany({
    data: [
      // STANDARD
      { plan: SubscriptionPlan.STANDARD, billingPeriod: BillingPeriod.MONTHLY, pricePerMonth: 2.99, totalBilled: 2.99 },
      { plan: SubscriptionPlan.STANDARD, billingPeriod: BillingPeriod.QUARTERLY, pricePerMonth: 2.79, totalBilled: 8.37 },
      { plan: SubscriptionPlan.STANDARD, billingPeriod: BillingPeriod.SEMI_ANNUAL, pricePerMonth: 2.39, totalBilled: 14.34 },
      { plan: SubscriptionPlan.STANDARD, billingPeriod: BillingPeriod.ANNUAL, pricePerMonth: 2.29, totalBilled: 27.48 },

      // SMART
      { plan: SubscriptionPlan.SMART, billingPeriod: BillingPeriod.MONTHLY, pricePerMonth: 4.19, totalBilled: 4.19 },
      { plan: SubscriptionPlan.SMART, billingPeriod: BillingPeriod.QUARTERLY, pricePerMonth: 3.89, totalBilled: 11.67 },
      { plan: SubscriptionPlan.SMART, billingPeriod: BillingPeriod.SEMI_ANNUAL, pricePerMonth: 3.77, totalBilled: 22.62 },
      { plan: SubscriptionPlan.SMART, billingPeriod: BillingPeriod.ANNUAL, pricePerMonth: 3.49, totalBilled: 41.88 },

      // PREMIUM
      { plan: SubscriptionPlan.PREMIUM, billingPeriod: BillingPeriod.MONTHLY, pricePerMonth: 5.99, totalBilled: 5.99 },
      { plan: SubscriptionPlan.PREMIUM, billingPeriod: BillingPeriod.QUARTERLY, pricePerMonth: 5.09, totalBilled: 15.27 },
      { plan: SubscriptionPlan.PREMIUM, billingPeriod: BillingPeriod.SEMI_ANNUAL, pricePerMonth: 4.99, totalBilled: 29.94 },
      { plan: SubscriptionPlan.PREMIUM, billingPeriod: BillingPeriod.ANNUAL, pricePerMonth: 4.69, totalBilled: 56.28 },
    ],
  });

  // 2. Super Admin
  const admin = await prisma.user.create({
    data: {
      name: "Starry Health Siège",
      email: "admin@starryhealth.com",
      username: "admin",
      password: adminPasswordHash,
      slug: "admin",
      role: Role.SUPER_ADMIN,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      primaryColor: "#0f766e",
      bio: "Administration Centrale Starry Health & Starry Digital.",
      contactPhone: "+243 810 000 000",
      contactEmail: "contact@starryhealth.com",
      contactAddress: "Gombe, Kinshasa, RDC",
      contactWebsite: "www.starryhealth.com",
      whatsapp: "+243810000000",
      facebook: "https://facebook.com/starryhealth",
      instagram: "https://instagram.com/starryhealth",
      copyright: `© ${new Date().getFullYear()} Starry Health Global. Tous droits réservés.`,
      tenantConfig: {
        create: {
          orgName: "Starry Health Global",
          orgDescription: "Leader mondial dans la distribution de compléments et technologies de bien-être prouvées scientifiquement.",
          orgLogo: "/assets/logo.png",
          secondaryColor: "#0284c7",
          headerColor: "#0f766e",
          fontFamily: "Inter",
        },
      },
    },
  });

  // 3. Test User: "Jean Dupont" with SMART plan
  const userJean = await prisma.user.create({
    data: {
      name: "Jean Dupont",
      email: "user@starryhealth.com",
      username: "user",
      password: userPasswordHash,
      slug: "user",
      role: Role.USER,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionPlan: SubscriptionPlan.SMART,
      primaryColor: "#0284c7",
      bio: "Distributeur Certifié. Spécialiste en micronutrition et vitalité.",
      contactPhone: "+243 990 123 456",
      contactEmail: "jean.dupont@starryhealth.com",
      contactAddress: "Boulevard du 30 Juin, Kinshasa",
      contactWebsite: "jean.starryhealth.com",
      whatsapp: "+243990123456",
      facebook: "https://facebook.com/jeandupont",
      instagram: "https://instagram.com/jeandupont_health",
      copyright: `© ${new Date().getFullYear()} Espace Santé Jean Dupont - Partenaire Agréé Starry Health.`,
      tenantConfig: {
        create: {
          orgName: "Cabinet Vitalité & Nutrition",
          orgDescription: "Accompagnement holistique, détoxification et renforcement immunitaire sur mesure.",
          orgLogo: "/assets/logo.png",
          secondaryColor: "#0369a1",
          headerColor: "#0284c7",
          fontFamily: "Inter",
        },
      },
      subscriptions: {
        create: {
          plan: SubscriptionPlan.SMART,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  // 4. Test User: "Sarah Lukusa" with PREMIUM plan
  const userSarah = await prisma.user.create({
    data: {
      name: "Dr. Sarah Lukusa",
      email: "sarah@starryhealth.com",
      username: "sarah",
      password: userPasswordHash,
      slug: "sarah",
      role: Role.USER,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      primaryColor: "#7c3aed",
      bio: "Médecin nutritionniste & Ambassadrice Starry Health.",
      contactPhone: "+243 890 000 111",
      contactEmail: "dr.sarah@starryhealth.com",
      contactAddress: "Avenue de la Paix, Kinshasa",
      contactWebsite: "sarahlukusa.com",
      whatsapp: "+243890000111",
      facebook: "https://facebook.com/drsarahlukusa",
      instagram: "https://instagram.com/dr.sarah_nutrition",
      copyright: `© ${new Date().getFullYear()} Dr. Sarah Lukusa Clinic. Tous droits réservés.`,
      tenantConfig: {
        create: {
          orgName: "Clinique Santé & Longévité",
          orgDescription: "Centre de référence en médecine préventive, rééquilibrage nutritionnel et bien-être cellulaire.",
          orgLogo: "/assets/logo.png",
          secondaryColor: "#9333ea",
          headerColor: "#7c3aed",
          fontFamily: "Outfit",
        },
      },
      subscriptions: {
        create: {
          plan: SubscriptionPlan.PREMIUM,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
      customDomain: {
        create: {
          domain: "sarahlukusa.com",
          verifiedAt: new Date(),
        },
      },
    },
  });

  // 5. Global Products (admin)
  const prod1 = await prisma.product.create({
    data: {
      userId: null,
      name: "Starry Vitality Plus",
      description: "Formule naturelle hautement concentrée en antioxydants, multivitamines et minéraux essentiels pour revitaliser l'organisme.",
      defaultPrice: 45.0,
      originalPrice: 55.0, // Shows 18% discount
      images: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
      category: "Compléments Alimentaires",
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      userId: null,
      name: "Starry Detox Bio Cleanse",
      description: "Solution détoxifiante 100% bio pour purifier le foie, favoriser la digestion et restaurer la clarté intestinale.",
      defaultPrice: 38.0,
      originalPrice: 48.0, // Shows 21% discount
      images: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80",
      category: "Détox & Pureté",
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      userId: null,
      name: "Starry Omega Shield 3-6-9",
      description: "Huile de poisson sauvage de qualité supérieure pure et purifiée pour soutenir le système cardiovasculaire et la concentration.",
      defaultPrice: 52.0,
      originalPrice: 65.0, // Shows 20% discount
      images: "https://images.unsplash.com/photo-1550572017-edf7928d10c8?auto=format&fit=crop&w=800&q=80",
      category: "Santé Cardiovasculaire",
    },
  });

  const prod4 = await prisma.product.create({
    data: {
      userId: null,
      name: "Starry Immune Booster",
      description: "Synergie de Vitamine C liposomale, Zinc et Extrait d'Échinacée bio pour renforcer les défenses immunitaires naturelles.",
      defaultPrice: 40.0,
      originalPrice: 50.0, // Shows 20% discount
      images: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      category: "Système Immunitaire",
    },
  });

  // 6. User Custom Pricing for Jean Dupont
  await prisma.userProductPrice.createMany({
    data: [
      { userId: userJean.id, productId: prod1.id, customPrice: 39.99 },
      { userId: userJean.id, productId: prod2.id, customPrice: 32.50 },
    ],
  });

  // 7. Services for Jean Dupont (SMART plan)
  await prisma.service.createMany({
    data: [
      { userId: userJean.id, name: "Consultation Bilan Nutritionnel (30 min)", url: "https://wa.me/243990123456?text=Je%20souhaite%20un%20bilan", order: 1 },
      { userId: userJean.id, name: "Programme Détox Express 14 Jours", url: "https://wa.me/243990123456?text=Programme%20Detox", order: 2 },
      { userId: userJean.id, name: "Suivi Personnalisé Mensuel", url: null, order: 3 },
    ],
  });

  // Services for Dr. Sarah (PREMIUM plan)
  await prisma.service.createMany({
    data: [
      { userId: userSarah.id, name: "Consultation Clinique Approfondie", url: "https://wa.me/243890000111", order: 1 },
      { userId: userSarah.id, name: "Programme Immunité & Longévité 90 Jours", url: "https://wa.me/243890000111", order: 2 },
      { userId: userSarah.id, name: "Ateliers Nutrition en Entreprise", url: null, order: 3 },
    ],
  });

  // 8. FAQ for Dr. Sarah (PREMIUM plan)
  await prisma.fAQ.createMany({
    data: [
      {
        userId: userSarah.id,
        question: "Comment utiliser les compléments alimentaires en toute sécurité ?",
        answer: "Nos compléments sont formulés à base d'ingrédients naturels standardisés. Il est conseillé de suivre la posologie indiquée sur chaque flacon ou de solliciter une consultation personnalisée.",
        order: 1,
      },
      {
        userId: userSarah.id,
        question: "Quels sont les délais de livraison à Kinshasa et en province ?",
        answer: "À Kinshasa, la livraison s'effectue sous 24h ouvrées. En province et à l'international, comptez entre 3 et 5 jours selon le transporteur.",
        order: 2,
      },
      {
        userId: userSarah.id,
        question: "Puis-je commander directement via WhatsApp ?",
        answer: "Absolument ! Il vous suffit de cliquer sur le panier puis sur 'Commander via WhatsApp' pour transmettre directement votre sélection.",
        order: 3,
      },
    ],
  });

  // 9. Gallery for Dr. Sarah (PREMIUM plan)
  await prisma.galleryImage.createMany({
    data: [
      {
        userId: userSarah.id,
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        caption: "Notre laboratoire de contrôle qualité et recherche clinique.",
        order: 1,
      },
      {
        userId: userSarah.id,
        imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
        caption: "Sélection rigoureuse des plantes et principes actifs 100% purs.",
        order: 2,
      },
      {
        userId: userSarah.id,
        imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
        caption: "Séances de consultation et accompagnement bien-être en cabinet.",
        order: 3,
      },
    ],
  });

  // 10. Global Carousel Items
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

  // Carousel for Jean
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

  // 11. Testimonials
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
      {
        userId: userJean.id,
        authorName: "Sarah Lukusa",
        content: "Jean m'a très bien conseillée sur la cure Détox Bio Cleanse. Service impeccable et livraison ultra-rapide !",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
    ],
  });

  // 12. Partners
  await prisma.partner.createMany({
    data: [
      { name: "Oqata Corporate", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80", website: "https://oqata.com" },
      { name: "BioCare Labs", logoUrl: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=300&q=80", website: "#" },
      { name: "PhytoLab Europe", logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=300&q=80", website: "#" },
      { name: "Global Health Alliance", logoUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=300&q=80", website: "#" },
    ],
  });

  // 13. Admin Suggestions (from subscribers to Starry Health Admin)
  await prisma.adminSuggestion.createMany({
    data: [
      {
        userId: userJean.id,
        subject: "Demande de nouveau pack Vitalité & Diffuseur",
        message: "Bonjour l'équipe Starry Health, plusieurs de mes clients réguliers souhaiteraient un coffret combinant Starry Vitality Plus et un diffuseur d'huiles essentielles. Serait-il possible de l'ajouter au catalogue ?",
        isRead: false,
      },
      {
        userId: userSarah.id,
        subject: "Félicitations pour le système de domaines personnalisés !",
        message: "Mon nom de domaine clinique fonctionne à merveille. La navigation est fluide et mes patients sont ravis du professionnalisme du site.",
        isRead: true,
      },
    ],
  });

  console.log("Database seeded successfully with all plans, pricings, users, and multi-tenant configs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
