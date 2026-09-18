'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import { ProductType } from '@/lib/types/product';
import { ShoppingBag, Eye, Zap, Sparkles } from 'lucide-react';

export type { ProductType };

interface ProductCardProps {
  product: ProductType;
  locale: Locale;
  dictionary: any;
}

export function ProductCard({ product, locale, dictionary }: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80';

  const technology =
    product.specs?.technology || product.specs?.Technology || (product.category === 'PRINTER' ? 'FDM' : 'Hardware');
  const speed = product.specs?.speed || product.specs?.printSpeed || product.speed;
  const buildVolume = product.specs?.buildVolume || product.specs?.volume || product.buildVolume;
  const brand = product.specs?.brand || product.brand || 'CBV Industrial';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      titleEn: product.name,
      titleFr: product.name,
      price: product.price,
      image: imageUrl,
      technology: String(technology),
      stock: product.stock,
    });
  };

  return (
    <div className="group flex flex-col bg-surface-light rounded-2xl border border-surface-border hover:border-charcoal-black hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Visual / Image Area */}
      <div className="relative aspect-4/3 bg-surface-subtle overflow-hidden border-b border-surface-border">
        {/* Technology Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-surface-light/90 backdrop-blur border border-surface-border text-charcoal shadow-xs">
            {technology}
          </span>
          {product.featured && (
            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-eco-500 text-white shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Brand Stamp */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[11px] font-semibold text-charcoal-muted bg-surface-light/80 backdrop-blur px-2 py-0.5 rounded">
            {brand}
          </span>
        </div>

        {/* Main Product Image */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-charcoal-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="px-4 py-2 rounded-xl bg-white text-charcoal-black text-xs font-bold shadow-md hover:bg-surface-subtle transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{dictionary.catalog.viewDetails || 'View Specs'}</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-charcoal-black line-clamp-1 group-hover:text-eco-500 transition-colors">
            <Link href={`/${locale}/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="pt-2 border-t border-surface-border/80 flex items-center justify-between text-[11px] text-charcoal-subtle font-medium">
          {speed && (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-eco-500" />
              <span>{String(speed)}</span>
            </div>
          )}
          {buildVolume && (
            <span className="text-charcoal-muted">{String(buildVolume)}</span>
          )}
        </div>

        {/* Pricing & CTA Button */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-black text-charcoal-black block leading-none">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-charcoal-subtle line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-600 text-white text-xs font-bold shadow-xs hover:shadow transition-all focus:outline-none"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{dictionary.catalog.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
