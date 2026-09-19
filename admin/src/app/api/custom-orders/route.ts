import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CustomRequest from '@/lib/models/CustomRequest';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const requests = await CustomRequest.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ requests, orders: requests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    await connectDB();
    const updated = await CustomRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
