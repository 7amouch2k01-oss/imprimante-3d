import { z } from 'zod';

/**
 * Shared Input Validation Schemas following OWASP guidelines:
 * - Strict length constraints
 * - Regex pattern checks preventing malicious characters & prototype pollution
 * - Type coercion prevention
 */

// User Authentication Schemas
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, 'Name contains invalid characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254, 'Email too long'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(254),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty')
    .max(128),
});

// Checkout & Order Schemas
export const shippingAddressSchema = z.object({
  street: z.string().trim().min(3, 'Street address must be at least 3 characters').max(150),
  city: z.string().trim().min(2, 'City name is required').max(100),
  postalCode: z
    .string()
    .trim()
    .min(2, 'Valid postal code is required')
    .max(20)
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid postal code format'),
  country: z.string().trim().min(2).max(60),
});

export const orderItemSchema = z.object({
  productId: z.string().trim().min(1, 'Product ID is required'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(999, 'Maximum order quantity is 999'),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Customer name is required')
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, 'Name contains invalid characters'),
  customerEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('Valid customer email is required')
    .max(254),
  shippingAddress: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item').max(50),
});

// Circular Recycling & Waitlist Schemas
export const recyclingWaitlistSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254),
  interest: z
    .enum(['RECYCLING', 'FILAMENT_TRADE_IN', 'CIRCULAR_ECONOMY', 'EQUIPMENT_RECOVERY'])
    .default('RECYCLING'),
  languagePref: z.enum(['en', 'fr']).default('en'),
});

// Dedicated schema for POST /api/recycling/subscribe
export const recyclingSubscribeSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254),
  preferredLanguage: z.enum(['en', 'fr']).optional().default('en'),
  languagePref: z.enum(['en', 'fr']).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type RecyclingWaitlistInput = z.infer<typeof recyclingWaitlistSchema>;
export type RecyclingSubscribeInput = z.infer<typeof recyclingSubscribeSchema>;
