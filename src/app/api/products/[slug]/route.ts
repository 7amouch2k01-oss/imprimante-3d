import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';
import { rateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = rateLimit(`product-detail:${ip}`, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const requestedLang = (searchParams.get('lang') || 'en').toLowerCase();

    const product = await Product.findOne({ slug: params.slug }).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const reviews = await Review.find({ productId: product._id })
      .populate('userId', 'name')
      .lean();

    const activeTr =
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

    const averageRating =
      reviews.length > 0
        ? Number(
            (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 5.0;

    return NextResponse.json({
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
      translations: product.translations,
      reviews: reviews.map((r) => ({
        id: String(r._id),
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: { name: r.userName || (r as any).userId?.name || 'Client CBV-3D', city: r.userCity },
      })),
      reviewsCount: reviews.length,
      averageRating,
    });
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
