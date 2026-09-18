import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, sanitizeString } from '@/lib/security';
import { recyclingWaitlistSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Strict rate limit on waitlist submissions: 5 per minute per IP
    const rateCheck = rateLimit(`waitlist:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again shortly.',
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
    const parsed = recyclingWaitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid waitlist submission',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeString(parsed.data.email);
    const existing = await db.recyclingWaitlist.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already registered on our circular recycling waitlist!',
      });
    }

    const subscriber = await db.recyclingWaitlist.create({
      data: {
        email: cleanEmail,
        preferredLanguage: parsed.data.languagePref,
      },
    });

    return NextResponse.json({
      success: true,
      subscriber,
      message: 'Successfully subscribed to the circular recycling program waitlist!',
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
