import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CustomRequest from '@/lib/models/CustomRequest';
import { rateLimit } from '@/lib/security';
import { z } from 'zod';

const customOrderSchema = z.object({
  customerName: z.string().trim().min(2, 'Name is required'),
  customerPhone: z.string().trim().min(8, 'Valid phone number is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  category: z.string().default('KEYCHAINS'),
  customText: z.string().optional(),
  colorPreference: z.string().optional(),
  dimensions: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`custom-req:${ip}`, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = customOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const newRequest = await CustomRequest.create(parsed.data);

    return NextResponse.json({
      success: true,
      message: 'Custom order request received successfully',
      requestId: newRequest._id,
    });
  } catch (error) {
    console.error('POST /api/custom-requests error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
