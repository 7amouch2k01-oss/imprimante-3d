import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { rateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`products:${ip}`, 120, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const requestedLang = (searchParams.get('lang') || 'en').toLowerCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'featured';

    // Build filter
    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Build sort
    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price-low') sortQuery = { price: 1 };
    else if (sort === 'price-high') sortQuery = { price: -1 };
    else if (sort === 'featured') sortQuery = { featured: -1, createdAt: -1 };

    const rawProducts = await Product.find(filter).sort(sortQuery).lean();

    // Localize
    const localizedProducts = rawProducts.map((product) => {
      let activeTr =
        product.translations.find((t) => t.languageCode === requestedLang) ||
        product.translations.find((t) => t.languageCode === 'en') ||
        product.translations[0];

      const specs: Record<string, string> = activeTr?.specs
        ? Object.fromEntries(
            activeTr.specs instanceof Map
              ? activeTr.specs
              : Object.entries(activeTr.specs as Record<string, string>)
          )
        : {};

      return {
        id: String(product._id),
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        category: product.category,
        featured: product.featured,
        images: product.images || [],
        name: activeTr?.name || product.slug,
        description: activeTr?.description || '',
        specs,
        language: activeTr?.languageCode || 'en',
      };
    });

    // Optional text search
    let result = localizedProducts;
    if (search) {
      const q = search.toLowerCase();
      result = localizedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ language: requestedLang, count: result.length, products: result });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
