import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, sanitizeString } from '@/lib/security';
import { recyclingSubscribeSchema } from '@/lib/validations';

/**
 * POST /api/recycling/subscribe
 * Validates and stores waitlist entries for the CBV-3D PRINTING recycling program:
 * - Validates email and preferred language ('en' | 'fr')
 * - Enforces rate limiting
 * - Prevents duplicate registrations gracefully
 */
export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Strict rate limit: 5 submissions per minute per IP
    const rateCheck = rateLimit(`recycling-subscribe:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again in a few moments.',
          retryAfter: rateCheck.reset,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.reset),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': String(rateCheck.remaining),
          },
        }
      );
    }

    const body = await request.json();
    const parsed = recyclingSubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid recycling waitlist submission',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeString(parsed.data.email).toLowerCase();
    const preferredLanguage = parsed.data.preferredLanguage || parsed.data.languagePref || 'en';

    // Check if user is already on waitlist
    const existing = await db.recyclingWaitlist.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: true,
          alreadySubscribed: true,
          entry: existing,
          message:
            preferredLanguage === 'fr'
              ? 'Vous êtes déjà inscrit sur notre liste d\'attente de recyclage CBV-3D!'
              : 'You are already registered on the CBV-3D recycling program waitlist!',
        },
        { status: 200 }
      );
    }

    // Create new waitlist entry
    const newEntry = await db.recyclingWaitlist.create({
      data: {
        email: cleanEmail,
        preferredLanguage,
      },
    });

    return NextResponse.json(
      {
        success: true,
        alreadySubscribed: false,
        entry: newEntry,
        message:
          preferredLanguage === 'fr'
            ? 'Votre inscription au programme de recyclage CBV-3D a été enregistrée avec succès!'
            : 'You have been successfully registered to the CBV-3D recycling program waitlist!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Recycling subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process recycling waitlist subscription' },
      { status: 500 }
    );
  }
}