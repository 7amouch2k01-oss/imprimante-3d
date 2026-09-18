import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long for cryptographic security'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.string().default('http://localhost:3000')),
  // Stripe configuration (optional in dev/mock mode, validated if present)
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  // Upstash / Redis configuration (optional for distributed rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  PORT: z.string().optional().default('3000'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid or missing environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    
    // In production or during server runtime, prevent startup with missing critical configuration
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Critical environment variable validation failed. Aborting startup.');
    }
    return process.env as unknown as Env;
  }

  return parsed.data;
}

export const env = validateEnv();
