import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './lib/i18n/config';
import { addSecurityHeaders, applyCorsHeaders, rateLimit } from './lib/security';

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage && acceptLanguage.toLowerCase().startsWith('fr')) {
    return 'fr';
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const origin = request.headers.get('origin');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  // Handle CORS preflight requests for API routes
  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    const preflightResponse = new NextResponse(null, { status: 204 });
    applyCorsHeaders(preflightResponse, origin);
    return addSecurityHeaders(preflightResponse);
  }

  // Edge rate limiting for API endpoints (Global 120 req / minute / IP)
  if (pathname.startsWith('/api')) {
    const rateLimitResult = rateLimit(`global_api:${ip}`, 120, 60000);
    if (!rateLimitResult.allowed) {
      const throttledResponse = NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'API rate limit exceeded. Please retry after cooling down.',
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.reset),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      );
      applyCorsHeaders(throttledResponse, origin);
      return addSecurityHeaders(throttledResponse);
    }
  }

  // Next.js static assets, Next internal files, and images pass-through with security headers
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    const res = NextResponse.next();
    return addSecurityHeaders(res);
  }

  // If it's an API route passing rate limiting, add CORS + security headers
  if (pathname.startsWith('/api')) {
    const res = NextResponse.next();
    applyCorsHeaders(res, origin);
    return addSecurityHeaders(res);
  }

  // Check if pathname already has a supported locale prefix
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const res = NextResponse.next();
    return addSecurityHeaders(res);
  }

  // Redirect to localized URL with security headers
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
