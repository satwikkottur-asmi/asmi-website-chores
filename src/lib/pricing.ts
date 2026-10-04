// Public plan catalog for /pricing.
//
// - Mirrors prod Stripe prices in mvp_app_internal: backend/payments/products/prod.py (+ base.py)
// - No API call → the page is static and crawlable; update here when prod.py changes
// - Terms §5.1 (src/routes/terms-and-conditions.tsx) hardcodes these prices → update it too
// - Display names match SubscriptionTier (STANDARD → "Pro", STANDARD_PLUS → "Ultra")

export type BillingInterval = "month" | "year";

export interface PricingPlan {
  key: string;
  name: string;
  tasksPerMonth: number;
  price: Record<BillingInterval, number>; // USD
  featured?: boolean;
}

export const PLANS: PricingPlan[] = [
  { key: "pro", name: "Pro", tasksPerMonth: 20, price: { month: 10, year: 99 } },
  {
    key: "ultra",
    name: "Ultra",
    tasksPerMonth: 100,
    price: { month: 49, year: 499 },
    featured: true,
  },
];

// Shared across tiers (schema.py _COMMON_FEATURES)
export const COMMON_FEATURES = [
  "Asmi completes tasks via calls, texts & emails",
  "Reminders, follow-ups, and coordination handled",
];

export function formatUsd(amount: number): string {
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}
