'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { CategoryTabs } from '@/components/navigation/CategoryTabs';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import { ShoppingBag, DollarSign, Euro, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  locale: Locale;
  dictionary: any;
}

export function Header({ locale, dictionary }: HeaderProps) {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 backdrop-blur border-b border-surface-border transition-all">
      {/* Top Banner: Eco commitment announcement */}
      <div className="bg-charcoal text-surface-light text-xs font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-eco-400 animate-pulse" />
        <span>
          {locale === 'fr'
            ? 'Pionnier de l’impression 3D éco-responsable — Tolérance industrielle & filament recyclé certifié'
            : 'Pioneering eco-responsible 3D printing — Industrial tolerance & closed-loop recycled spools'}
        </span>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="focus:outline-none">
            <Logo size="md" />
          </Link>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dynamic Currency Switcher ($ / €) */}
            <div className="flex items-center p-1 rounded-lg bg-surface-subtle border border-surface-border text-xs font-bold text-charcoal">
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-1 rounded flex items-center gap-0.5 transition-all ${
                  currency === 'EUR'
                    ? 'bg-eco-500 text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                aria-label="Euro Currency"
              >
                <Euro className="w-3.5 h-3.5" />
                <span>EUR</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded flex items-center gap-0.5 transition-all ${
                  currency === 'USD'
                    ? 'bg-eco-500 text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                aria-label="US Dollar Currency"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>USD</span>
              </button>
            </div>

            {/* Language Switcher (EN / FR) */}
            <LanguageSwitcher currentLocale={locale} />

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-xl border border-surface-border bg-surface-light hover:bg-surface-subtle text-charcoal hover:border-eco-500 transition-all focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-charcoal" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs font-bold bg-eco-500 text-white shadow-sm ring-2 ring-surface-light animate-in zoom-in-50 duration-200">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dual Category Tabs */}
      <CategoryTabs locale={locale} dictionary={dictionary} />
    </header>
  );
}
