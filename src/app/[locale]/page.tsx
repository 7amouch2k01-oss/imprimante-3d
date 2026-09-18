import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { Hero } from '@/components/home/Hero';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductType } from '@/lib/types/product';
import { RecyclingTeaser } from '@/components/recycling/RecyclingTeaser';
import { ArrowRight, Layers, Paintbrush, Truck, ShieldCheck, Heart, Sliders } from 'lucide-react';

import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface HomePageProps {
  params: { locale: Locale };
}

function resolveTranslation(product: any, locale: string) {
  return (
    product.translations.find((t: any) => t.languageCode === locale) ||
    product.translations.find((t: any) => t.languageCode === 'fr') ||
    product.translations[0]
  );
}

function resolveSpecs(t: any): Record<string, string> {
  if (!t?.specs) return {};
  if (t.specs instanceof Map) return Object.fromEntries(t.specs);
  return Object.fromEntries(Object.entries(t.specs as Record<string, string>));
}

const CATEGORIES_SHOWCASE = [
  { id: 'KEYCHAINS', nameFr: 'Porte-clés', nameEn: 'Keychains', price: 'Dès 5 DT' },
  { id: 'PHONE_STANDS', nameFr: 'Supports tél.', nameEn: 'Phone stands', price: 'Dès 15 DT' },
  { id: 'GAMING_ACCESSORIES', nameFr: 'Gaming setup', nameEn: 'Gaming accessories', price: 'Dès 20 DT' },
  { id: 'DECORATION', nameFr: 'Décoration', nameEn: '3D Decor', price: 'Dès 20 DT' },
  { id: 'GIFTS', nameFr: 'Cadeaux', nameEn: 'Custom gifts', price: 'Dès 25 DT' },
  { id: 'PIGGY_BANKS', nameFr: 'Tirelires', nameEn: 'Piggy banks', price: 'Dès 18 DT' },
  { id: 'UTILITY', nameFr: 'Utilitaires', nameEn: 'Utility items', price: 'Dès 6 DT' },
];

export default async function HomePage({ params }: HomePageProps) {
  const isFr = params.locale === 'fr';
  const dictionary = await getDictionary(params.locale);

  let featuredProducts: ProductType[] = [];
  try {
    await connectDB();

    let rawProducts = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    if (rawProducts.length === 0) {
      rawProducts = await Product.find({}).sort({ createdAt: -1 }).limit(6).lean();
    }

    featuredProducts = rawProducts.map((p) => {
      const t = resolveTranslation(p, params.locale);
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
  } catch (e) {
    console.error('Error loading products for homepage:', e);
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <Hero locale={params.locale} dictionary={dictionary} />

      {/* 2. Quick Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="p-4 sm:p-6 rounded-3xl bg-surface-light border border-surface-border shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-4 flex items-center justify-between">
            <span>{isFr ? 'Nos Catégories Populaires' : 'Popular Categories'}</span>
            <Link
              href={`/${params.locale}/custom-order`}
              className="text-eco-600 hover:text-eco-700 flex items-center gap-1 font-bold normal-case text-xs"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>{isFr ? 'Demande Sur-Mesure →' : 'Request Custom Item →'}</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CATEGORIES_SHOWCASE.map((cat) => (
              <Link
                key={cat.id}
                href={`/${params.locale}/catalog`}
                className="p-3 rounded-2xl bg-surface-subtle hover:bg-surface-light border border-surface-border hover:border-eco-500/40 transition-all text-center space-y-2 group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-surface-border flex items-center justify-center mx-auto transition-colors group-hover:border-eco-500/30">
                  <CategoryIcon id={cat.id} size={20} />
                </div>
                <div className="text-xs font-bold text-charcoal-black group-hover:text-eco-600 transition-colors">
                  {isFr ? cat.nameFr : cat.nameEn}
                </div>
                <div className="text-[10px] font-semibold text-charcoal-muted group-hover:text-eco-600 transition-colors">{cat.price}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured 3D Creations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-eco-500 bg-eco-50 px-2.5 py-1 rounded-md">
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? 'Bestsellers en Tunisie' : 'Tunisia Best Picks'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal-black tracking-tight">
              {isFr ? 'Produits 3D Recommandés' : 'Featured 3D Creations'}
            </h2>
            <p className="text-sm text-charcoal-muted max-w-xl">
              {isFr
                ? 'Sélection d’objets imprimés avec passion dans notre atelier : finition propre, filaments solides et prix en Dinars Tunisiens.'
                : 'Handpicked custom creations: clean finish, durable materials and accessible prices in TND.'}
            </p>
          </div>

          <Link
            href={`/${params.locale}/catalog`}
            className="inline-flex items-center gap-2 text-sm font-bold text-eco-500 hover:text-eco-600 transition-colors group"
          >
            <span>{isFr ? 'Voir Tout le Catalogue (DT)' : 'View Full Catalog'}</span>
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

      {/* 4. Value Proposition Feature Strip */}
      <section className="bg-surface-subtle border-y border-surface-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light border border-surface-border">
              <div className="w-12 h-12 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal-black">
                  {isFr ? 'Personnalisation 100% Libre' : '100% Customization'}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {isFr
                    ? 'Ajoutez votre nom, vos initiales, votre date fétiche ou le logo de votre voiture sur n’importe quel modèle.'
                    : 'Personalize with names, wedding dates, or car logos in high-resolution 3D.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light border border-surface-border">
              <div className="w-12 h-12 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal-black">
                  {isFr ? 'Livraison Rapide Toute la Tunisie' : 'Fast Tunisia Delivery'}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {isFr
                    ? 'Fabrication sous 24 à 48h et livraison sécurisée à domicile sur les 24 gouvernorats.'
                    : '24-48h fabrication turnaround and reliable delivery to all 24 governorates.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-light border border-surface-border">
              <div className="w-12 h-12 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal-black">
                  {isFr ? 'Prix Accessible dès 5 DT' : 'Accessible Pricing from 5 DT'}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {isFr
                    ? 'Des tarifs adaptés au marché tunisien avec une qualité d’impression soignée et vérifiée.'
                    : 'Direct maker prices in Tunisian Dinars with strict print quality checks.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Custom Order Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-charcoal-black text-white p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-bold uppercase">
              <Paintbrush className="w-3.5 h-3.5" />
              <span>{isFr ? 'Service Sur-Mesure' : 'Custom Request'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isFr
                ? 'Vous avez un fichier STL ou une idée précise ?'
                : 'Have an STL file or custom idea?'}
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              {isFr
                ? 'Contactez notre atelier directement pour un devis instantané et une impression 3D sur-mesure aux couleurs de votre choix.'
                : 'Get in touch with our team for an instant quote and personalized 3D print in the filament color of your choice.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href={`/${params.locale}/custom-order`}
                className="px-6 py-3 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md transition-all"
              >
                {isFr ? 'Commander Mon Objet Personnalisé' : 'Request My Custom Creation'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recycling Initiative Teaser Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecyclingTeaser locale={params.locale} dictionary={dictionary} />
      </div>
    </div>
  );
}
