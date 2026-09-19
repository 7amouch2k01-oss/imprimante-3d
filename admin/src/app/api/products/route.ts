import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { titleEn, titleFr, descriptionEn, descriptionFr, price, stock, category, featured, images } = body;

    if (!titleEn && !titleFr) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const baseTitle = (titleEn || titleFr || 'produit-3d').trim();
    const slug = `${baseTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}-${Date.now().toString().slice(-4)}`;

    const translations = [
      {
        languageCode: 'en',
        name: titleEn || titleFr,
        description: descriptionEn || descriptionFr || '',
        specs: {},
      },
      {
        languageCode: 'fr',
        name: titleFr || titleEn,
        description: descriptionFr || descriptionEn || '',
        specs: {},
      },
    ];

    const imageList = Array.isArray(images) && images.length > 0
      ? images
      : ['/images/hero-printer.jpg'];

    const product = await Product.create({
      slug,
      price: Number(price) || 10,
      stock: Number(stock) || 0,
      category: category || 'KEYCHAINS',
      featured: Boolean(featured),
      images: imageList,
      translations,
    });

    return NextResponse.json({ product, success: true }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, titleEn, titleFr, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update translations if titles provided
    if (titleEn || titleFr) {
      const enTr = existing.translations.find((t) => t.languageCode === 'en');
      const frTr = existing.translations.find((t) => t.languageCode === 'fr');
      if (enTr && titleEn) enTr.name = titleEn;
      if (frTr && titleFr) frTr.name = titleFr;
    }

    Object.assign(existing, updates);
    const updated = await existing.save();

    return NextResponse.json({ product: updated, success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
