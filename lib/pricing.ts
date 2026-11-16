/** Canonical price of the B2B Business Fundability Audit (Gate 1). Single source of truth — no $350 or $497 literal anywhere else. */
export const AUDIT_PRICE = 497;

/** Canonical Stripe checkout URL, sourced from env (never hardcoded). */
export const AUDIT_STRIPE_URL: string =
  process.env.NEXT_PUBLIC_TIER_B_STRIPE_URL ??
  process.env.NEXT_PUBLIC_AUDIT_STRIPE_URL ??
  "";