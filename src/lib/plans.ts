export type SubscriptionPlanTier = "STANDARD" | "SMART" | "PREMIUM";

export function getProductLimit(plan: string | null | undefined): number {
  if (plan === "PREMIUM") return Infinity;
  if (plan === "SMART") return 10;
  return 5; // STANDARD
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
