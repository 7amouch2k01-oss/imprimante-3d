'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import { ShoppingBag, Sparkles, Wand2, Grid } from 'lucide-react';

interface HeaderProps {
  locale: Locale;
  dictionary: any;
}

export function Header({ locale, dictionary }: HeaderProps) {
  const isFr = locale === 'fr';
  const { totalItems, setIsDrawerOpen } = useCart();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 backdrop-blur border-b border-surface-border transition-all">
      {/* Top Banner: Tunisia Delivery & Custom Order */}
      <div className="bg-charcoal-black text-surface-light text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-eco-400 animate-pulse" />
        <span>
          {isFr
            ? 'Atelier d’impression 3D en Tunisie — Produits personnalisés sur-mesure & livraison 24-48h'
            : '3D Printing Studio in Tunisia — Custom on-demand creations & fast nationwide delivery'}
        </span>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="focus:outline-none">
            <Logo size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-subtle p-1.5 rounded-2xl border border-surface-border">
            <Link
              href={`/${locale}/catalog`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-white hover:text-eco-600 transition-all shadow-2xs group"
            >
              <Grid className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-eco-500 transition-colors" />
              <span>{isFr ? 'Catalogue Produits 3D' : '3D Products Catalog'}</span>
            </Link>

            <Link
              href={`/${locale}/custom-order`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-eco-500 hover:bg-eco-600 transition-all shadow-xs"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Commander Sur-Mesure' : 'Custom Order'}</span>
            </Link>

            <Link
              href={`/${locale}/recycling`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-all"
            >
              <span>{isFr ? 'Éco-Recyclage' : 'Eco-Recycling'}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-surface-border text-charcoal-black font-bold uppercase">
                Bientôt
              </span>
            </Link>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dynamic Currency Switcher (TND / EUR) */}
            <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-surface-border text-xs font-bold text-charcoal">
              <button
                type="button"
                onClick={() => setCurrency('TND')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  currency === 'TND'
                    ? 'bg-eco-500 text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                aria-label="Tunisian Dinar"
              >
                <span>DT (TND)</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                  currency === 'EUR'
                    ? 'bg-eco-500 text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                aria-label="Euro Currency"
              >
                <span>EUR (€)</span>
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
    </header>
  );
}
