import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RecyclingWaitlist from '@/lib/models/RecyclingWaitlist';
import { rateLimit } from '@/lib/security';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferredLanguage: z.enum(['en', 'fr']).default('en'),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`recycling-subscribe:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const { email, preferredLanguage } = parsed.data;

    // Upsert — idempotent subscribe
    await RecyclingWaitlist.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), preferredLanguage },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to recycling program updates',
    });
  } catch (error) {
    console.error('POST /api/recycling/subscribe error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}