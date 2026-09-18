import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products?lang=en
 * Dynamic product retrieval with fallback localization (e.g. ?lang=en or ?lang=fr).
 * Falls back to 'en' or first available translation if requested language is missing.
 */
export async function GET(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate limiting: 120 requests per minute
    const rateCheck = rateLimit(`products:${ip}`, 120, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const requestedLang = (searchParams.get('lang') || 'en').toLowerCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'featured';

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    } else if (sort === 'featured') {
      orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
    }

    // Retrieve products with all related translations
    const rawProducts = await db.product.findMany({
      where,
      orderBy,
      include: {
        translations: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        },
      },
    });

    // Localize products dynamically with fallback logic
    const localizedProducts = rawProducts.map((product) => {
      // Find translation for requested language (e.g., 'fr' or 'en')
      let activeTranslation = product.translations.find(
        (t) => t.languageCode === requestedLang
      );

      // Fallback 1: Default to English ('en')
      if (!activeTranslation) {
        activeTranslation = product.translations.find((t) => t.languageCode === 'en');
      }

      // Fallback 2: Take first available translation
      if (!activeTranslation && product.translations.length > 0) {
        activeTranslation = product.translations[0];
      }

      // Safely parse specs JSON
      let parsedSpecs: Record<string, any> = {};
      if (activeTranslation?.specs) {
        try {
          parsedSpecs = JSON.parse(activeTranslation.specs);
        } catch {
          parsedSpecs = {};
        }
      }

      // Safely parse images JSON
      let parsedImages: string[] = [];
      try {
        parsedImages = JSON.parse(product.images);
      } catch {
        parsedImages = product.images ? [product.images] : [];
      }

      return {
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
        reviewsCount: product.reviews.length,
        averageRating:
          product.reviews.length > 0
            ? Number(
                (
                  product.reviews.reduce((acc, r) => acc + r.rating, 0) /
                  product.reviews.length
                ).toFixed(1)
              )
            : 5.0,
      };
    });

    // Handle optional text search filter against localized name and description
    let filteredProducts = localizedProducts;
    if (search) {
      const q = search.toLowerCase();
      filteredProducts = localizedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      language: requestedLang,
      count: filteredProducts.length,
      products: filteredProducts,
    });
  } catch (error) {
    console.error('API Products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

