'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { Logo } from '@/components/ui/Logo';
import { ShieldCheck, Leaf, Heart, ArrowRight } from 'lucide-react';

interface FooterProps {
  locale: Locale;
  dictionary: any;
}

export function Footer({ locale, dictionary }: FooterProps) {
  return (
    <footer className="bg-surface-subtle border-t border-surface-border text-charcoal text-sm mt-auto">
      {/* Top Value Strip */}
      <div className="border-b border-surface-border bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal">Zero-Waste Standard</h4>
              <p className="text-xs text-charcoal-muted">Closed-loop polymer reclamation & reusable spool hubs.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal">Industrial Quality</h4>
              <p className="text-xs text-charcoal-muted">±0.02mm laser calibrated precision on all active models.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-50 border border-eco-200 flex items-center justify-center text-eco-500 flex-shrink-0">
              <span className="font-black text-eco-500 text-base">2Y</span>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal">Comprehensive Warranty</h4>
              <p className="text-xs text-charcoal-muted">Full 2-year warranty with European parts support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-charcoal-muted max-w-sm leading-relaxed">
              {locale === 'fr'
                ? 'CBV-3D PRINTING développe l’écosystème d’impression 3D le plus vertueux : matériel haute performance, support de classe mondiale et circuit fermé de recyclage des polymères.'
                : 'CBV-3D PRINTING engineers the most sustainable additive manufacturing ecosystem: industrial-grade printers, high-speed tolerance, and circular polymer recycling.'}
            </p>
            <div className="text-xs text-charcoal-subtle pt-2">
              <span>Operated under CBV Advanced Systems • ISO 14001 Compliant</span>
            </div>
          </div>

          {/* Catalog & Hardware */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal">
              {dictionary.catalog.title || '3D Printers'}
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href={`/${locale}/catalog`} className="hover:text-eco-500 transition-colors">
                  FDM High-Speed Printers
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog`} className="hover:text-eco-500 transition-colors">
                  SLA Resin Precision
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog`} className="hover:text-eco-500 transition-colors">
                  Industrial SLS Additive
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/recycling`} className="hover:text-eco-500 transition-colors flex items-center gap-1">
                  <span>Recycled Filaments</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">Soon</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Circular Economy */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal">
              {dictionary.recycling.badge || 'Recycling Initiative'}
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href={`/${locale}/recycling`} className="hover:text-eco-500 transition-colors">
                  Spool Trade-in Program
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/recycling`} className="hover:text-eco-500 transition-colors">
                  Pre-paid Polymer Return Kits
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/recycling`} className="hover:text-eco-500 transition-colors">
                  CO2 Offset Calculator
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/recycling`} className="hover:text-eco-500 transition-colors">
                  Pilot Lab Waitlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-subtle">
          <p>© 2026 CBV-3D PRINTING. {dictionary.footer.rights || 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-charcoal cursor-pointer">Privacy & GDPR</span>
            <span>•</span>
            <span className="hover:text-charcoal cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-charcoal cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
