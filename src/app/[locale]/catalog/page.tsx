import React from 'react';
import type { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { ProductType } from '@/lib/types/product';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { Printer } from 'lucide-react';

interface CatalogPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  return {
    title: dictionary.catalog.title || '3D Printers Catalog',
    description: dictionary.catalog.subtitle,
  };
}

function resolveSpecs(t: any): Record<string, string> {
  if (!t?.specs) return {};
  if (t.specs instanceof Map) return Object.fromEntries(t.specs);
  return Object.fromEntries(Object.entries(t.specs as Record<string, string>));
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const dictionary = await getDictionary(params.locale);

  let products: ProductType[] = [];
  try {
    await connectDB();

    const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

    products = rawProducts.map((p) => {
      const t =
        p.translations.find((tr: any) => tr.languageCode === params.locale) ||
        p.translations.find((tr: any) => tr.languageCode === 'en') ||
        p.translations[0];

      const specs = resolveSpecs(t);

      return {
        id: String(p._id),
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        category: p.category,
        featured: p.featured,
        images: p.images || [],
        name: t?.name || p.slug,
        description: t?.description || '',
        specs,
        technology: specs.technology || (p.category === 'PRINTER' ? 'FDM' : 'Hardware'),
        speed: specs.speed || specs['Print Speed'],
        buildVolume: specs.buildVolume || specs['Build Volume'],
        brand: specs.brand || 'CBV Industrial',
      };
    });
  } catch (error) {
    console.error('Failed to load products from database:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Catalog Header */}
      <div className="space-y-2 border-b border-surface-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-eco-50 text-eco-500 border border-eco-200">
          <Printer className="w-3.5 h-3.5" />
          <span>Active Product Hardware</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-black tracking-tight">
          {dictionary.catalog.title || '3D Printers & Hardware Catalog'}
        </h1>
        <p className="text-sm text-charcoal-muted max-w-2xl">
          {dictionary.catalog.subtitle || 'Browse our curated selection of verified industrial and desktop 3D printers.'}
        </p>
      </div>

      {/* Filterable Product Grid Component */}
      <ProductGrid
        initialProducts={products}
        locale={params.locale}
        dictionary={dictionary}
      />
    </div>
  );
}
