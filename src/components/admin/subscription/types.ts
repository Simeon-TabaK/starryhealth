export type PlanType = "STANDARD" | "SMART" | "PREMIUM";
export type SubscriptionStatus = "ACTIVE" | "PENDING" | "EXPIRED" | "REFUSED" | "REJECTED" | "SUSPENDED" | string;

export interface SubscriptionItem {
  id: number;
  userId: number;
  plan: PlanType;
  status: SubscriptionStatus;
  durationMonths: number;
  startDate?: string | Date | null;
  expiresAt?: string | Date | null;
  requestedAt?: string | Date | null;
  createdAt?: string | Date;
  adminNotes?: string | null;
  user?: {
    id: number;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    slug?: string | null;
  };
}

export interface SubscriptionHistoryItem {
  id: number;
  userId: number;
  action: string;
  plan: PlanType;
  status: SubscriptionStatus;
  durationMonths?: number | null;
  notes?: string | null;
  createdAt: string | Date;
  performedBy?: number | null;
  user?: {
    id: number;
    name?: string | null;
    username?: string | null;
    email?: string | null;
  };
}

export interface PlanPricingItem {
  plan: string;
  billingPeriod: string;
  totalBilled?: number;
}

export interface PricingCalculationResult {
  unitPrice: number;
  durationMonths: number;
  grossTotal: number;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  finalTotal: number;
  effectiveMonthly: number;
}

