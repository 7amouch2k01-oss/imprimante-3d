import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const COOKIE_NAME = 'cbv_admin_auth';

export function verifyAdminCookie(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME);
  return cookie?.value === ADMIN_PIN;
}

export function setAdminCookie(response: NextResponse, pin: string): NextResponse {
  response.cookies.set(COOKIE_NAME, pin, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
  return response;
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAME);
  return response;
}

export function checkPin(pin: string): boolean {
  return pin === ADMIN_PIN;
}
