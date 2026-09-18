import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RecyclingWaitlist from '@/lib/models/RecyclingWaitlist';
import { rateLimit } from '@/lib/security';
import { z } from 'zod';

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferredLanguage: z.enum(['en', 'fr']).default('en'),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`waitlist:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const { email, preferredLanguage } = parsed.data;

    const existing = await RecyclingWaitlist.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: true, message: 'Already on the waitlist', alreadyRegistered: true },
        { status: 200 }
      );
    }

    await RecyclingWaitlist.create({ email, preferredLanguage });

    return NextResponse.json({
      success: true,
      message: 'Successfully added to recycling waitlist',
    });
  } catch (error) {
    console.error('POST /api/recycling-waitlist error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
