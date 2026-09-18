import { NextRequest, NextResponse } from 'next/server';
import { checkPin, setAdminCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pin } = body;

  if (!pin || !checkPin(pin)) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminCookie(response, pin);
  return response;
}
