import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20' as any,
      typescript: true,
    })
  : null;

export const isStripeConfigured = Boolean(stripeSecretKey && stripeSecretKey.startsWith('sk_'));