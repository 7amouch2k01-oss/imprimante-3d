'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { Sparkles, Printer, Recycle } from 'lucide-react';

interface CategoryTabsProps {
  locale: Locale;
  dictionary: any;
}

export function CategoryTabs({ locale, dictionary }: CategoryTabsProps) {
  const pathname = usePathname();

  const isPrintersActive =
    pathname === `/${locale}` ||
    pathname === `/${locale}/catalog` ||
    pathname.startsWith(`/${locale}/products`);

  const isRecyclingActive = pathname === `/${locale}/recycling`;

  return (
    <div className="flex items-center space-x-2 border-b border-surface-border bg-surface-light px-4 sm:px-6">
      {/* 3D Printers Tab (Active default) */}
      <Link
        href={`/${locale}/catalog`}
        className={`group relative flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-150 ${
          isPrintersActive
            ? 'border-eco-500 text-eco-500'
            : 'border-transparent text-charcoal-muted hover:text-charcoal-black hover:border-surface-border'
        }`}
      >
        <Printer className={`w-4 h-4 ${isPrintersActive ? 'text-eco-500' : 'text-charcoal-subtle group-hover:text-charcoal'}`} />
        <span>{dictionary.nav.printers || '3D Printers'}</span>
        {isPrintersActive && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-eco-50 text-eco-500">
            Active
          </span>
        )}
      </Link>

      {/* Recycling / Recyclage Tab (with "Coming Soon" Badge) */}
      <Link
        href={`/${locale}/recycling`}
        className={`group relative flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-150 ${
          isRecyclingActive
            ? 'border-eco-500 text-eco-500'
            : 'border-transparent text-charcoal-muted hover:text-charcoal-black hover:border-surface-border'
        }`}
      >
        <Recycle className={`w-4 h-4 ${isRecyclingActive ? 'text-eco-500' : 'text-charcoal-subtle group-hover:text-charcoal'}`} />
        <span>{dictionary.nav.recycling || 'Recycling / Recyclage'}</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200">
          <Sparkles className="w-2.5 h-2.5" />
          {dictionary.nav.comingSoon || 'Coming Soon'}
        </span>
      </Link>
    </div>
  );
}
