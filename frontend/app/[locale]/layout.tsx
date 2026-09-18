import React from 'react';
import type { Metadata } from 'next';
import '@/app/globals.css';
import { i18n, Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { CartProvider } from '@/lib/store/cart-context';
import { CurrencyProvider } from '@/lib/store/currency-context';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  return {
    title: {
      template: `%s | CBV-3D PRINTING`,
      default: `CBV-3D PRINTING — Eco-Responsible Industrial 3D Printers & Recycled Polymers`,
    },
    description:
      params.locale === 'fr'
        ? 'Magasin officiel CBV-3D PRINTING : imprimantes 3D de précision industrielle, filaments éco-responsables et programme de recyclage en boucle fermée.'
        : 'Official CBV-3D PRINTING Store: industrial-precision 3D printers, eco-conscious materials, and closed-loop circular recycling.',
    keywords: ['3D printers', 'CBV-3D PRINTING', 'recycling', 'FDM', 'SLA', 'sustainable filament', 'additive manufacturing'],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dictionary = await getDictionary(params.locale);

  return (
    <html lang={params.locale} className="h-full bg-white text-charcoal">
      <body className="flex flex-col min-h-screen antialiased bg-white text-charcoal selection:bg-eco-100 selection:text-eco-900">
        <CurrencyProvider>
          <CartProvider>
            <Header locale={params.locale} dictionary={dictionary} />
            <main className="flex-1">
              {children}
            </main>
            <Footer locale={params.locale} dictionary={dictionary} />
            <CartDrawer locale={params.locale} dictionary={dictionary} />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
