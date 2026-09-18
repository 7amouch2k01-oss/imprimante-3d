'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import { Locale } from '@/lib/i18n/config';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  locale: Locale;
  dictionary: any;
}

export function CartDrawer({ locale, dictionary }: CartDrawerProps) {
  const { items, isDrawerOpen, setIsDrawerOpen, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-charcoal-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-full sm:max-w-md bg-surface-light shadow-2xl flex flex-col border-l border-surface-border"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border bg-surface-subtle">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-eco-500" />
                  <h2 className="text-lg font-bold text-charcoal">
                    {dictionary.cart.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-eco-50 text-eco-500">
                    {items.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-surface-muted transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body: Itemization */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-surface-border">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-surface-subtle flex items-center justify-center mb-4 text-charcoal-subtle">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <p className="text-base font-semibold text-charcoal mb-1">
                      {dictionary.cart.empty}
                    </p>
                    <p className="text-xs text-charcoal-subtle max-w-xs mb-6">
                      {dictionary.cart.emptySubtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-600 text-white text-sm font-semibold transition-colors shadow-sm"
                    >
                      {dictionary.cart.startShopping}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-4 py-3 group">
                        {/* Product Thumbnail */}
                        <div className="w-20 h-20 rounded-lg bg-surface-subtle border border-surface-border overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80'}
                            alt={locale === 'fr' ? item.titleFr : item.titleEn}
                            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Product Details & Controls */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-eco-500 bg-eco-50 px-1.5 py-0.5 rounded">
                                {item.technology}
                              </span>
                              <h3 className="text-sm font-semibold text-charcoal line-clamp-1 mt-1">
                                {locale === 'fr' ? item.titleFr : item.titleEn}
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-charcoal-subtle hover:text-red-600 p-1 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-surface-border rounded-lg bg-surface-subtle overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 text-charcoal-muted hover:text-charcoal hover:bg-surface-muted transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-charcoal select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 text-charcoal-muted hover:text-charcoal hover:bg-surface-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Item Subtotal in Dynamic Currency */}
                            <div className="text-right">
                              <span className="text-xs text-charcoal-subtle block">
                                {formatPrice(item.price)} each
                              </span>
                              <span className="text-sm font-bold text-charcoal">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer: Totals & Checkout Button */}
              {items.length > 0 && (
                <div className="p-6 border-t border-surface-border bg-surface-subtle space-y-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-charcoal-muted">
                      <span>{dictionary.cart.subtotal}</span>
                      <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-muted text-xs">
                      <span>{dictionary.cart.shipping}</span>
                      <span className="text-eco-500 font-bold">{dictionary.cart.shippingCalculated}</span>
                    </div>
                    <div className="flex justify-between text-charcoal font-bold text-base pt-2 border-t border-surface-border">
                      <span>{dictionary.cart.total}</span>
                      <span className="text-eco-500">{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/${locale}/checkout`}
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <span>{dictionary.cart.checkout}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full py-2 text-xs font-semibold text-charcoal-subtle hover:text-charcoal transition-colors text-center"
                    >
                      {dictionary.cart.clear}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal-subtle">
                    <ShieldCheck className="w-3.5 h-3.5 text-eco-500" />
                    <span>256-Bit SSL Encrypted • Eco-Safe Packaging</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
