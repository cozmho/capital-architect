import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key, { apiVersion: '2025-01-27' as any });
  return _stripe;
}

// Backwards compat for existing imports
export const stripe = {
  checkout: {
    sessions: {
      create: async (params: any) => {
        const s = getStripe();
        if (!s) throw new Error('Stripe not configured');
        return s.checkout.sessions.create(params);
      },
      list: async (params: any) => {
        const s = getStripe();
        if (!s) throw new Error('Stripe not configured');
        return s.checkout.sessions.list(params);
      },
    },
  },
} as any;
