import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { ProductType } from '@/lib/types/product';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { Sparkles, Wand2 } from 'lucide-react';

interface CatalogPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const isFr = params.locale === 'fr';
  return {
    title: isFr
      ? 'Catalogue Produits 3D & Créations en Tunisie | CBV 3D PRINTING'
      : '3D Printed Creations & Catalog Tunisia | CBV 3D PRINTING',
    description: isFr
      ? 'Découvrez nos porte-clés, supports téléphone, accessoires gaming et cadeaux personnalisés imprimés en 3D en Tunisie.'
      : 'Browse custom 3D keychains, phone holders, gaming desk docks and gifts printed in Tunisia.',
  };
}

function resolveSpecs(t: any): Record<string, string> {
  if (!t?.specs) return {};
  if (t.specs instanceof Map) return Object.fromEntries(t.specs);
  return Object.fromEntries(Object.entries(t.specs as Record<string, string>));
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const isFr = params.locale === 'fr';
  const dictionary = await getDictionary(params.locale);

  let products: ProductType[] = [];
  try {
    await connectDB();

    const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

    products = rawProducts.map((p) => {
      const t =
        p.translations.find((tr: any) => tr.languageCode === params.locale) ||
        p.translations.find((tr: any) => tr.languageCode === 'fr') ||
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
        technology: specs.technology || 'Impression 3D FDM',
        speed: specs.speed,
        buildVolume: specs.buildVolume,
        brand: 'CBV 3D Tunisie',
      };
    });
  } catch (error) {
    console.error('Failed to load products from database:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-border pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-eco-50 text-eco-600 border border-eco-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFr ? 'Créations & Objets 3D' : '3D Printed Creations'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-black tracking-tight">
            {isFr ? 'Catalogue Produits & Idées 3D' : '3D Products & Gift Ideas'}
          </h1>
          <p className="text-sm text-charcoal-muted max-w-2xl">
            {isFr
              ? 'Objets prêts à expédier ou personnalisables avec votre nom, logo ou date en Dinars Tunisiens (DT).'
              : 'Browse ready-to-ship models or order custom personalized versions with fast delivery across Tunisia.'}
          </p>
        </div>

        <Link
          href={`/${params.locale}/custom-order`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{isFr ? 'Demande Sur-Mesure ✨' : 'Custom Request ✨'}</span>
        </Link>
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
