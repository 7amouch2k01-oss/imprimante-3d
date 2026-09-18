'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@/lib/i18n/config';
import { ProductType } from '@/lib/types/product';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useCurrency } from '@/lib/store/currency-context';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  initialProducts: ProductType[];
  locale: Locale;
  dictionary: any;
}

export function ProductGrid({ initialProducts, locale, dictionary }: ProductGridProps) {
  const { currency, setCurrency } = useCurrency();

  // Filters state
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedFilament, setSelectedFilament] = useState<string>('all');
  const [selectedSpeedRange, setSelectedSpeedRange] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filamentOptions = useMemo(() => {
    return ['PLA', 'PETG', 'ABS', 'TPU', 'Carbon', 'Nylon', 'Resin'];
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search
      const search = searchQuery.toLowerCase();
      const name = (product.name || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      if (search && !name.includes(search) && !desc.includes(search)) {
        return false;
      }

      // Technology filter
      const tech = (product.specs?.technology || product.specs?.Technology || 'FDM').toUpperCase();
      if (selectedTech !== 'all') {
        if (!tech.includes(selectedTech)) return false;
      }

      // Max price
      if (product.price > maxPrice) {
        return false;
      }

      // Filament type filter
      if (selectedFilament !== 'all') {
        const text = `${product.name} ${product.description} ${JSON.stringify(product.specs || {})}`.toLowerCase();
        if (!text.includes(selectedFilament.toLowerCase())) {
          return false;
        }
      }

      // Print speed filter
      if (selectedSpeedRange !== 'all') {
        const speedStr = String(product.specs?.speed || product.specs?.printSpeed || product.speed || '');
        const speedNum = parseInt(speedStr.replace(/\D/g, '') || '0', 10);
        if (selectedSpeedRange === 'high' && speedNum < 500) return false;
        if (selectedSpeedRange === 'mid' && (speedNum < 250 || speedNum >= 500)) return false;
        if (selectedSpeedRange === 'standard' && (speedNum >= 250 || speedNum === 0)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'speed') {
        const speedA = parseInt(String(a.specs?.speed || a.speed || '0').replace(/\D/g, '') || '0', 10);
        const speedB = parseInt(String(b.specs?.speed || b.speed || '0').replace(/\D/g, '') || '0', 10);
        return speedB - speedA;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    initialProducts,
    searchQuery,
    selectedTech,
    selectedFilament,
    selectedSpeedRange,
    maxPrice,
    sortBy,
    locale,
  ]);

  const resetFilters = () => {
    setSelectedTech('all');
    setSelectedFilament('all');
    setSelectedSpeedRange('all');
    setMaxPrice(3000);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-subtle border border-surface-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dictionary.nav.searchPlaceholder || 'Search 3D printers, filaments...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-white text-sm text-charcoal placeholder-charcoal-subtle focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none transition-all"
          />
        </div>

        {/* Currency & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dynamic Currency Toggle */}
          <div className="flex items-center rounded-xl border border-surface-border bg-white p-1 text-xs font-bold text-charcoal shadow-xs">
            <span className="px-2 text-[11px] text-charcoal-subtle font-semibold">
              {dictionary.catalog.currency || 'Currency'}:
            </span>
            <button
              type="button"
              onClick={() => setCurrency('EUR')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'EUR' ? 'bg-eco-500 text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              € EUR
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currency === 'USD' ? 'bg-eco-500 text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              $ USD
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
                <option value="featured">{dictionary.catalog.sortFeatured}</option>
                <option value="price-low">{dictionary.catalog.sortPriceLow}</option>
                <option value="price-high">{dictionary.catalog.sortPriceHigh}</option>
                <option value="speed">{locale === 'fr' ? 'Vitesse max' : 'Top Print Speed'}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2.5 rounded-xl border border-surface-border bg-white hover:bg-surface-subtle text-charcoal-muted hover:text-charcoal transition-colors"
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
              <span>{dictionary.catalog.filters}</span>
            </div>
            <span className="text-xs font-semibold text-eco-500 bg-eco-50 px-2 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>

          {/* Technology filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
              {dictionary.catalog.technology}
            </label>
            <div className="flex flex-col space-y-1">
              {[
                { id: 'all', label: dictionary.catalog.allTechnologies },
                { id: 'FDM', label: 'FDM / FFF (Filament)' },
                { id: 'SLA', label: 'SLA / MSLA (Resin)' },
                { id: 'SLS', label: 'SLS (Powder Sintering)' },
              ].map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedTech(tech.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedTech === tech.id
                      ? 'bg-eco-500 text-white shadow-xs'
                      : 'text-charcoal-muted hover:bg-white hover:text-charcoal'
                  }`}
                >
                  {tech.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filament Type Filter */}
          <div className="space-y-2 pt-2 border-t border-surface-border">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
              {dictionary.catalog.filamentType || 'Filament Type'}
            </label>
            <select
              value={selectedFilament}
              onChange={(e) => setSelectedFilament(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-xs font-medium text-charcoal focus:border-eco-500 outline-none"
            >
              <option value="all">{dictionary.catalog.allFilaments || 'All Filaments'}</option>
              {filamentOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Print Speed Filter */}
          <div className="space-y-2 pt-2 border-t border-surface-border">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
              {dictionary.catalog.speed || 'Print Speed'}
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'all', label: dictionary.catalog.allSpeeds || 'All Speeds' },
                { id: 'high', label: 'High Speed (> 500 mm/s)' },
                { id: 'mid', label: 'Accelerated (250 - 500 mm/s)' },
                { id: 'standard', label: 'Precision Standard (< 250 mm/s)' },
              ].map((spd) => (
                <button
                  key={spd.id}
                  type="button"
                  onClick={() => setSelectedSpeedRange(spd.id)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSpeedRange === spd.id
                      ? 'bg-eco-50 text-eco-500 font-bold border border-eco-200'
                      : 'text-charcoal-muted hover:bg-white hover:text-charcoal'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-3 pt-2 border-t border-surface-border">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-charcoal">
                {dictionary.catalog.priceRange}
              </label>
              <span className="font-bold text-eco-500">Up to €{maxPrice}</span>
            </div>
            <input
              type="range"
              min={200}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-eco-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-subtle font-medium">
              <span>€200</span>
              <span>€1,500</span>
              <span>€3,000+</span>
            </div>
          </div>
        </aside>

        {/* Products Grid Output */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-surface-subtle border border-surface-border">
              <Filter className="w-12 h-12 text-charcoal-subtle mx-auto mb-3 stroke-1" />
              <h3 className="text-base font-bold text-charcoal mb-1">
                {dictionary.catalog.noProducts}
              </h3>
              <p className="text-xs text-charcoal-muted mb-4 max-w-sm mx-auto">
                {locale === 'fr'
                  ? 'Essayez de réinitialiser vos filtres ou de modifier votre terme de recherche.'
                  : 'Try resetting your filter parameters or adjusting your search term.'}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-eco-500 text-white text-xs font-bold hover:bg-eco-600 transition-colors shadow-xs"
              >
                Reset All Filters
              </button>
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
