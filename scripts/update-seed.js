const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../prisma/seed.ts');
let content = fs.readFileSync(filePath, 'utf8');

const target = 'await prisma.subscriptionPlanPricing.createMany({';
const addition = `await (prisma as any).subscriptionPlanConfig.createMany({
    data: [
      {
        name: 'STANDARD',
        displayName: 'Standard',
        description: 'Idéal pour démarrer votre activité de distributeur et présenter vos produits clés.',
        monthlyPrice: 2.99,
        quarterlyPrice: 8.37,
        semiAnnualPrice: 14.34,
        annualPrice: 27.48,
        sortOrder: 1,
        color: '#10b981',
        icon: 'Shield',
        badge: 'Essentiel',
        features: [
          "Catalogue jusqu'à 5 produits",
          "Page vitrine personnalisée",
          "Témoignages & Partenaires",
          "Bouton WhatsApp direct",
          "Lien de partage personnalisé"
        ],
        limits: { maxProducts: 5, hasGallery: false, hasCustomDomain: false, hasFaq: false }
      },
      {
        name: 'SMART',
        displayName: 'Smart',
        description: 'Pour les distributeurs actifs souhaitant personnaliser leur vitrine et élargir leur offre.',
        monthlyPrice: 4.19,
        quarterlyPrice: 11.67,
        semiAnnualPrice: 22.62,
        annualPrice: 41.88,
        sortOrder: 2,
        color: '#0ea5e9',
        icon: 'Zap',
        badge: 'Populaire',
        features: [
          "Catalogue jusqu'à 10 produits",
          "Offres & Services avec liens personnalisés",
          "Personnalisation des couleurs du thème",
          "Tous les avantages Standard"
        ],
        limits: { maxProducts: 10, hasGallery: false, hasCustomDomain: false, hasFaq: false }
      },
      {
        name: 'PREMIUM',
        displayName: 'Premium',
        description: 'La solution complète sans limite : catalogue illimité, catégories, fiche détaillée et domaine.',
        monthlyPrice: 5.99,
        quarterlyPrice: 15.27,
        semiAnnualPrice: 29.94,
        annualPrice: 56.28,
        sortOrder: 3,
        color: '#f59e0b',
        icon: 'Crown',
        badge: 'Recommandé',
        features: [
          "Catalogue produits ILLIMITÉ",
          "Catégories et sous-catégories arborescentes",
          "Fiche produit détaillée (ingrédients, bienfaits, posologie)",
          "Galerie 'Notre univers en images'",
          "Section FAQ dynamique",
          "Nom de domaine personnalisé",
          "Typographie personnalisée"
        ],
        limits: { maxProducts: -1, hasGallery: true, hasCustomDomain: true, hasFaq: true, hasCategories: true }
      }
    ]
  });\n\n  `;

if (!content.includes('subscriptionPlanConfig.createMany')) {
  content = content.replace(target, addition + target);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated seed.ts');
} else {
  console.log('Already updated');
}

