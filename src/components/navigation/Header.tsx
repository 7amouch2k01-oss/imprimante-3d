'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { Logo } from '@/components/ui/Logo';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { useCart } from '@/lib/store/cart-context';
import { useCurrency } from '@/lib/store/currency-context';
import { ShoppingBag, Paintbrush, Grid, Menu, X, Recycle, ArrowRight } from 'lucide-react';

interface HeaderProps {
  locale: Locale;
  dictionary: any;
}

export function Header({ locale, dictionary }: HeaderProps) {
  const isFr = locale === 'fr';
  const pathname = usePathname();
  const { totalItems, setIsDrawerOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 backdrop-blur border-b border-surface-border transition-all">
      {/* Top Banner: Tunisia Delivery & Custom Order */}
      <div className="bg-charcoal-black text-surface-light text-[11px] sm:text-xs font-medium py-1.5 px-3 sm:px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-eco-400 animate-pulse flex-shrink-0" />
        <span className="truncate max-w-[90vw] sm:max-w-none">
          {isFr
            ? 'Atelier d’impression 3D en Tunisie — Sur-mesure & livraison 24-48h'
            : '3D Printing Studio Tunisia — Custom items & fast delivery'}
        </span>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="focus:outline-none flex-shrink-0">
            <Logo size="sm" className="sm:hidden" showSubtitle={false} />
            <Logo size="md" className="hidden sm:inline-flex" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-subtle p-1.5 rounded-2xl border border-surface-border">
            <Link
              href={`/${locale}/catalog`}
              className="flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-white hover:text-eco-600 transition-all shadow-2xs group"
            >
              <Grid className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-eco-500 transition-colors" />
              <span>{isFr ? 'Catalogue 3D' : '3D Catalog'}</span>
            </Link>

            <Link
              href={`/${locale}/custom-order`}
              className="flex items-center gap-2 px-3.5 lg:px-4 py-2 rounded-xl text-xs font-bold text-white bg-eco-500 hover:bg-eco-600 transition-all shadow-xs"
            >
              <Paintbrush className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Desktop Currency Switcher (TND / EUR) */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-surface-subtle border border-surface-border text-xs font-bold text-charcoal">
              <button
                type="button"
                onClick={() => setCurrency('TND')}
                className={`px-2 py-1 rounded-lg flex items-center transition-all ${
                  currency === 'TND'
                    ? 'bg-eco-500 text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                aria-label="Tunisian Dinar"
              >
                <span>DT</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-1 rounded-lg flex items-center transition-all ${
                  currency === 'EUR'
                    ? 'bg-eco-500 text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
                aria-label="Euro Currency"
              >
                <span>EUR</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="hidden xs:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl border border-surface-border bg-surface-light hover:bg-surface-subtle text-charcoal hover:border-eco-500 transition-all focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 rounded-full text-[10px] sm:text-xs font-bold bg-eco-500 text-white shadow-sm ring-2 ring-surface-light">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-surface-border bg-surface-light hover:bg-surface-subtle text-charcoal hover:text-eco-600 transition-colors focus:outline-none"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Slide-down with backdrop overlay) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[calc(100%+1px)] z-50 bg-white/98 backdrop-blur-lg border-b border-surface-border shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Primary Action Button */}
            <Link
              href={`/${locale}/custom-order`}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md transition-all"
            >
              <Paintbrush className="w-4 h-4" />
              <span>{isFr ? 'Commander du Sur-Mesure' : 'Order Custom 3D Item'}</span>
            </Link>

            {/* Navigation Links */}
            <div className="space-y-1 bg-surface-subtle p-2 rounded-2xl border border-surface-border">
              <Link
                href={`/${locale}/catalog`}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-charcoal hover:bg-white hover:text-eco-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Grid className="w-4 h-4 text-charcoal-muted" />
                  <span>{isFr ? 'Catalogue Produits 3D' : '3D Products Catalog'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal-subtle" />
              </Link>

              <Link
                href={`/${locale}/recycling`}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-charcoal hover:bg-white hover:text-eco-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Recycle className="w-4 h-4 text-charcoal-muted" />
                  <span>{isFr ? 'Éco-Recyclage de filaments' : 'Filament Recycling'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-border text-charcoal-black font-bold uppercase">
                  Bientôt
                </span>
              </Link>
            </div>

            {/* Controls: Currency & Language Switcher in Mobile Drawer */}
            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                  {isFr ? 'Devise' : 'Currency'}
                </span>
                <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-surface-border text-xs font-bold text-charcoal">
                  <button
                    type="button"
                    onClick={() => setCurrency('TND')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currency === 'TND'
                        ? 'bg-eco-500 text-white shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal'
                    }`}
                  >
                    DT (TND)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('EUR')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currency === 'EUR'
                        ? 'bg-eco-500 text-white shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal'
                    }`}
                  >
                    EUR (€)
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1.5 text-right">
                  {isFr ? 'Langue' : 'Language'}
                </span>
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
