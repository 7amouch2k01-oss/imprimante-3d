import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { db } from '@/lib/db';
import { Hero } from '@/components/home/Hero';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductType } from '@/lib/types/product';
import { RecyclingTeaser } from '@/components/recycling/RecyclingTeaser';
import { ArrowRight, Sparkles, Leaf, Shield, Cpu } from 'lucide-react';

interface HomePageProps {
  params: { locale: Locale };
}

export default async function HomePage({ params }: HomePageProps) {
  const dictionary = await getDictionary(params.locale);

  // Fetch featured products from db
  let featuredProducts: ProductType[] = [];
  try {
    const rawProducts = await db.product.findMany({
      where: { featured: true },
      take: 3,
      include: { translations: true },
      orderBy: { createdAt: 'desc' },
    });

    const productsToMap = rawProducts.length > 0 ? rawProducts : await db.product.findMany({
      take: 3,
      include: { translations: true },
      orderBy: { createdAt: 'desc' },
    });

    featuredProducts = productsToMap.map((p) => {
      let t = p.translations.find((tr) => tr.languageCode === params.locale);
      if (!t) t = p.translations.find((tr) => tr.languageCode === 'en');
      if (!t && p.translations.length > 0) t = p.translations[0];

      let parsedImages: string[] = [];
      try {
        parsedImages = JSON.parse(p.images);
      } catch {
        parsedImages = p.images ? [p.images] : [];
      }

      let parsedSpecs: Record<string, any> = {};
      if (t?.specs) {
        try {
          parsedSpecs = JSON.parse(t.specs);
        } catch {
          parsedSpecs = {};
        }
      }

      return {
        id: p.id,
        slug: p.slug,
        price: p.price,
        comparePrice: p.comparePrice,
        stock: p.stock,
        category: p.category,
        featured: p.featured,
        images: parsedImages,
        name: t?.name || p.slug,
        description: t?.description || '',
        specs: parsedSpecs,
        technology: parsedSpecs.technology || (p.category === 'PRINTER' ? 'FDM' : 'Hardware'),
        speed: parsedSpecs.speed || parsedSpecs.printSpeed,
        buildVolume: parsedSpecs.buildVolume || parsedSpecs.volume,
        brand: parsedSpecs.brand || 'CBV Industrial',
      };
    });
  } catch (e) {
    console.error('Error loading products for homepage:', e);
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <Hero locale={params.locale} dictionary={dictionary} />

      {/* 2. Featured 3D Printers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-eco-500 bg-eco-50 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Additive Precision</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-black tracking-tight">
              {params.locale === 'fr' ? 'Imprimantes 3D Recommandées' : 'Featured 3D Printers'}
            </h2>
            <p className="text-sm text-charcoal-muted max-w-xl">
              {params.locale === 'fr'
                ? 'Sélection de machines étalonnées en laboratoire, prêtes pour vos polymères standards ou recyclés.'
                : 'Lab-calibrated desktop & industrial systems ready for high-speed prototyping and circular materials.'}
            </p>
          </div>

          <Link
            href={`/${params.locale}/catalog`}
            className="inline-flex items-center gap-2 text-sm font-bold text-eco-500 hover:text-eco-600 transition-colors group"
          >
            <span>{dictionary.catalog.title || 'View Full Catalog'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={params.locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      </section>

      {/* 3. Value Proposition Feature Strip */}
      <section className="bg-surface-subtle border-y border-surface-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light border border-surface-border">
              <div className="w-12 h-12 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal-black">
                  {params.locale === 'fr' ? 'Boucle Circulaire Fermée' : 'Closed-Loop Circularity'}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {params.locale === 'fr'
                    ? 'Chaque gramme de plastique déchet est réutilisable en filament de qualité industrielle.'
                    : 'Transform failed prints and spent spools back into laser-gauged high-performance spools.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light border border-surface-border">
              <div className="w-12 h-12 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal-black">
                  {params.locale === 'fr' ? 'Précision Micrométrique' : 'Micron Precision'}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {params.locale === 'fr'
                    ? 'Tolérance de positionnement d’axe Z de 0.02 mm et cinématique CoreXY rapide.'
                    : 'Engineered with rigid CoreXY motion, auto-resonance calibration, and 0.02mm layer accuracy.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light border border-surface-border">
              <div className="w-12 h-12 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal-black">
                  {params.locale === 'fr' ? 'Garantie & Support Direct' : 'Direct Manufacturer Warranty'}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {params.locale === 'fr'
                    ? 'Support technique 24/7 par nos ingénieurs additifs certifiés.'
                    : 'Full 2-year warranty with instant parts dispatch and specialized maker assistance.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recycling Initiative Teaser Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecyclingTeaser locale={params.locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
