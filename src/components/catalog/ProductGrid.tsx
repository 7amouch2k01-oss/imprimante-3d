'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { ProductType } from '@/lib/types/product';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useCurrency } from '@/lib/store/currency-context';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  RotateCcw,
  Wand2,
  Sparkles,
} from 'lucide-react';

interface ProductGridProps {
  initialProducts: ProductType[];
  locale: Locale;
  dictionary: any;
}

export const CATEGORIES_LIST = [
  { id: 'all', labelFr: 'Tous les produits', labelEn: 'All Creations', icon: '✨' },
  { id: 'KEYCHAINS', labelFr: 'Porte-clés personnalisés', labelEn: 'Custom Keychains', icon: '🔑' },
  { id: 'PHONE_STANDS', labelFr: 'Supports téléphone', labelEn: 'Phone Stands', icon: '📱' },
  { id: 'GAMING_ACCESSORIES', labelFr: 'Accessoires gaming', labelEn: 'Gaming Accessories', icon: '🎧' },
  { id: 'DECORATION', labelFr: 'Décoration & Maison', labelEn: 'Home Decor', icon: '🏠' },
  { id: 'GIFTS', labelFr: 'Cadeaux personnalisés', labelEn: 'Custom Gifts', icon: '🎁' },
  { id: 'PIGGY_BANKS', labelFr: 'Tirelires 3D', labelEn: '3D Piggy Banks', icon: '🪙' },
  { id: 'UTILITY', labelFr: 'Objets Utilitaires', labelEn: 'Utility & Tools', icon: '🧰' },
];

export function ProductGrid({ initialProducts, locale, dictionary }: ProductGridProps) {
  const isFr = locale === 'fr';
  const { currency, setCurrency, formatPrice } = useCurrency();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search
        const search = searchQuery.toLowerCase();
        const name = (product.name || '').toLowerCase();
        const desc = (product.description || '').toLowerCase();
        if (search && !name.includes(search) && !desc.includes(search)) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (product.category !== selectedCategory) {
            return false;
          }
        }

        // Max price (in DT)
        if (product.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [initialProducts, searchQuery, selectedCategory, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(100);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-eco-500 text-white shadow-md shadow-eco-500/20 ring-2 ring-eco-500/30'
                  : 'bg-surface-subtle hover:bg-surface-border text-charcoal-black border border-surface-border'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isFr ? cat.labelFr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-subtle border border-surface-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isFr
                ? 'Rechercher porte-clé, support téléphone, vase...'
                : 'Search keychains, phone stand, decor...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-white text-sm text-charcoal placeholder-charcoal-subtle focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none transition-all font-medium"
          />
        </div>

        {/* Currency & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center rounded-xl border border-surface-border bg-white p-1 text-xs font-bold text-charcoal shadow-xs">
            <button
              type="button"
              onClick={() => setCurrency('TND')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'TND' ? 'bg-eco-500 text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              🇹🇳 DT
            </button>
            <button
              type="button"
              onClick={() => setCurrency('EUR')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'EUR' ? 'bg-eco-500 text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              € EUR
            </button>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-surface-border bg-white text-xs font-semibold text-charcoal focus:border-eco-500 outline-none transition-all"
                aria-label="Sort by"
              >
                <option value="featured">{isFr ? 'Recommandés' : 'Featured'}</option>
                <option value="price-low">{isFr ? 'Prix : Croissant' : 'Price: Low to High'}</option>
                <option value="price-high">{isFr ? 'Prix : Décroissant' : 'Price: High to Low'}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2.5 rounded-xl border border-surface-border bg-white hover:bg-surface-subtle text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar & Filtered Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 rounded-2xl border border-surface-border bg-surface-subtle/70 p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2 font-bold text-sm text-charcoal">
              <SlidersHorizontal className="w-4 h-4 text-eco-500" />
              <span>{isFr ? 'Filtres & Prix' : 'Filters & Price'}</span>
            </div>
            <span className="text-xs font-semibold text-eco-500 bg-eco-50 px-2 py-0.5 rounded-full">
              {filteredProducts.length} articles
            </span>
          </div>

          {/* Categories Filter in sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
              {isFr ? 'Catégories' : 'Categories'}
            </label>
            <div className="flex flex-col space-y-1">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-eco-500 text-white shadow-xs'
                      : 'text-charcoal-muted hover:bg-white hover:text-charcoal'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{isFr ? cat.labelFr : cat.labelEn}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider (TND / DT) */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-charcoal">
                {isFr ? 'Prix Maximum' : 'Max Price'}
              </label>
              <span className="font-bold text-eco-500">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-eco-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-subtle font-medium">
              <span>5 DT</span>
              <span>50 DT</span>
              <span>100 DT</span>
            </div>
          </div>

          {/* Custom Order Callout in Sidebar */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-eco-50 to-eco-100/50 border border-eco-200 text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-eco-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFr ? 'Besoin d’un modèle unique ?' : 'Need a custom model?'}</span>
            </div>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              {isFr
                ? 'Envoyez-nous votre prénom, logo d’entreprise ou modèle 3D pour une fabrication sur-mesure.'
                : 'Send us your custom text, logo or 3D design for on-demand fabrication.'}
            </p>
            <Link
              href={`/${locale}/custom-order`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-eco-600 hover:text-eco-700 pt-1"
            >
              <span>{isFr ? 'Commander Sur-Mesure →' : 'Custom Request →'}</span>
            </Link>
          </div>
        </aside>

        {/* Products Grid Output */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-surface-subtle border border-surface-border space-y-4">
              <div className="text-4xl">🎨</div>
              <h3 className="text-base font-bold text-charcoal">
                {isFr
                  ? 'Aucun article trouvé dans cette sélection'
                  : 'No 3D items found with current filters'}
              </h3>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                {isFr
                  ? 'Vous cherchez un objet spécifique ? Demandez-le directement à notre équipe pour qu’on l’imprime pour vous !'
                  : 'Looking for a specific item? Request it directly from our team to print it for you!'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-surface-light border border-surface-border text-charcoal text-xs font-bold hover:bg-surface-subtle"
                >
                  {isFr ? 'Réinitialiser' : 'Reset Filters'}
                </button>
                <Link
                  href={`/${locale}/custom-order`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-eco-500 text-white text-xs font-bold hover:bg-eco-600 shadow-xs"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Commander Sur-Mesure' : 'Order Custom'}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  dictionary={dictionary}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
