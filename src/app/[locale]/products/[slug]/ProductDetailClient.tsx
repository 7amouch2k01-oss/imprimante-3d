'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { ProductType } from '@/lib/types/product';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Box,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: ProductType;
  locale: Locale;
  dictionary: any;
}

export function ProductDetailClient({
  product,
  locale,
  dictionary,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  let images: string[] = [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  ];
  if (Array.isArray(product.images)) {
    images = product.images;
  } else if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) images = parsed;
    } catch {
      const imgStr = String(product.images);
      if (imgStr.startsWith('http')) {
        images = [imgStr];
      }
    }
  }

  let specsObj: Record<string, string> = {};
  if (product.specs && typeof product.specs === 'object') {
    specsObj = product.specs as Record<string, string>;
  } else if (typeof product.specs === 'string') {
    try {
      specsObj = JSON.parse(product.specs);
    } catch (e) {}
  }

  const title = product.name;
  const description = product.description;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        titleEn: product.name,
        titleFr: product.name,
        price: product.price,
        image: images[0],
        technology: product.technology || 'FDM',
        stock: product.stock,
      },
      quantity
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Back button */}
      <Link
        href={`/${locale}/catalog`}
        className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-muted hover:text-charcoal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 3D Printers Catalog</span>
      </Link>

      {/* Main product overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-surface-subtle border border-surface-border relative shadow-xs">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-light/95 backdrop-blur border border-surface-border text-eco-500 shadow-xs">
                {product.technology}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-eco-500 shadow-sm'
                      : 'border-surface-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-eco-500">
                {product.brand}
              </span>
              <span className="text-charcoal-subtle">•</span>
              <span className="text-xs font-semibold text-charcoal-muted">
                CBV Certified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-charcoal-black tracking-tight">
              {title}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-surface-border">
            <span className="text-3xl font-black text-charcoal-black">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-base text-charcoal-subtle line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span className="text-xs font-bold text-eco-500 bg-eco-50 px-2 py-0.5 rounded-full">
              In Stock & Ready
            </span>
          </div>

          {/* Overview text */}
          <p className="text-sm text-charcoal-muted leading-relaxed">
            {description}
          </p>

          {/* Key Quick Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {product.speed && (
              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border">
                <span className="text-[10px] uppercase font-bold text-charcoal-subtle block">
                  {dictionary.catalog.printSpeed}
                </span>
                <span className="text-xs font-bold text-charcoal">{product.speed}</span>
              </div>
            )}
            {product.buildVolume && (
              <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border">
                <span className="text-[10px] uppercase font-bold text-charcoal-subtle block">
                  {dictionary.catalog.buildVolume}
                </span>
                <span className="text-xs font-bold text-charcoal">{product.buildVolume}</span>
              </div>
            )}
          </div>

          {/* Quantity & Add to cart */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-surface-border rounded-xl bg-surface-subtle p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-charcoal hover:bg-white transition-colors"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm text-charcoal">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-charcoal hover:bg-white transition-colors"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{dictionary.catalog.addToCart}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-subtle pt-2">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-eco-500" />
                <span>Free Insured EU Freight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-eco-500" />
                <span>2-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Technical Specifications Table */}
      {Object.keys(specsObj).length > 0 && (
        <section className="pt-8 border-t border-surface-border space-y-6">
          <h2 className="text-xl font-bold text-charcoal-black">
            {dictionary.product.specifications || 'Technical Specifications'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specsObj).map(([key, value]) => (
              <div
                key={key}
                className="p-4 rounded-xl bg-surface-subtle border border-surface-border flex justify-between items-center text-xs"
              >
                <span className="font-bold text-charcoal capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-charcoal-muted font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
