export type SubscriptionPlanTier = "STANDARD" | "SMART" | "PREMIUM";

/**
 * Quota de produits par forfait.
 * La limitation restrictive à 5 produits a été levée pour permettre aux utilisateurs
 * d'ajouter leurs produits librement avec gestion par pagination.
 */
export function getProductLimit(plan: string | null | undefined): number {
  return Infinity;
}

export function planHasFeature(
  plan: string | null | undefined,
  feature: "services" | "colors" | "faq" | "gallery" | "font" | "customDomain"
): boolean {
  const tier = (plan as SubscriptionPlanTier) ?? "STANDARD";
  const tiers: Record<SubscriptionPlanTier, number> = {
    STANDARD: 1,
    SMART: 2,
    PREMIUM: 3,
  };
  const required: Record<string, number> = {
    services: 2,   // SMART+
    colors: 2,     // SMART+
    faq: 3,        // PREMIUM
    gallery: 3,    // PREMIUM
    font: 3,       // PREMIUM
    customDomain: 3, // PREMIUM
  };
  return (tiers[tier] ?? 1) >= (required[feature] ?? 1);
}
