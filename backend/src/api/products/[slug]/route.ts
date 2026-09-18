import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`product:${ip}`, 120, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const requestedLang = (searchParams.get('lang') || 'en').toLowerCase();
    const { slug } = params;

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        translations: true,
        reviews: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Localization with fallback
    let activeTranslation = product.translations.find((t) => t.languageCode === requestedLang);
    if (!activeTranslation) {
      activeTranslation = product.translations.find((t) => t.languageCode === 'en') || product.translations[0];
    }

    let parsedSpecs = {};
    if (activeTranslation?.specs) {
      try {
        parsedSpecs = JSON.parse(activeTranslation.specs);
      } catch {
        parsedSpecs = {};
      }
    }

    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(product.images);
    } catch {
      parsedImages = product.images ? [product.images] : [];
    }

    return NextResponse.json({
      product: {
        id: product.id,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        category: product.category,
        featured: product.featured,
        images: parsedImages,
        name: activeTranslation?.name || product.slug,
        description: activeTranslation?.description || '',
        specs: parsedSpecs,
        language: activeTranslation?.languageCode || 'en',
        reviews: product.reviews,
      },
    });
  } catch (error) {
    console.error('API Product by slug error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

