'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { ArrowRight, Layers, Paintbrush, Shield, Heart, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  locale: Locale;
  dictionary: any;
}

export function Hero({ locale, dictionary }: HeroProps) {
  const isFr = locale === 'fr';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-subtle via-white to-surface-subtle pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-surface-border">
      {/* Background eco-grid subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#116B36_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tunisia Studio Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-eco-50 border border-eco-200 text-eco-600 text-xs font-bold uppercase tracking-wider"
            >
              <Layers className="w-4 h-4 text-eco-500" />
              <span>{isFr ? 'Atelier d’Impression 3D Tunisie' : '3D Printing Studio Tunisia'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-500" />
              <span className="text-charcoal-muted font-semibold">
                {isFr ? 'Créations & Sur-Mesure' : 'Custom & Ready-Made'}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-charcoal-black tracking-tight leading-[1.1]"
            >
              <span>
                {isFr
                  ? 'Vos Idées & Objets Préférés, '
                  : 'Your Ideas & Favorite Designs, '}
              </span>
              <span className="block text-eco-500 mt-1">
                {isFr ? 'Imprimés en 3D en Tunisie.' : '3D Printed in Tunisia.'}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-charcoal-muted max-w-2xl leading-relaxed"
            >
              {isFr
                ? 'Porte-clés personnalisés (prénom, marque auto), supports téléphone & gaming, décoration intérieure, cadeaux de couple et objets uniques imprimés avec une précision au millimètre.'
                : 'Custom 3D printed keychains, ergonomic phone & gaming docks, decorative home pieces, and personalized gifts made in Tunisia.'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href={`/${locale}/custom-order`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none"
              >
                <Paintbrush className="w-4 h-4" />
                <span>{isFr ? 'Commander du Sur-Mesure' : 'Request Custom 3D Order'}</span>
              </Link>

              <Link
                href={`/${locale}/catalog`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-surface-light hover:bg-surface-subtle border-2 border-charcoal-black text-charcoal-black font-bold text-sm shadow-xs transition-all"
              >
                <span>{isFr ? 'Voir le Catalogue (DT)' : 'Browse Catalog (DT)'}</span>
                <ArrowRight className="w-4 h-4 text-eco-500" />
              </Link>
            </motion.div>

            {/* Trust points */}
            <div className="pt-6 border-t border-surface-border flex flex-wrap items-center gap-6 text-xs font-semibold text-charcoal-subtle">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-eco-500" />
                <span>{isFr ? 'Livraison toute la Tunisie' : 'Delivery Across Tunisia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-eco-500" />
                <span>{isFr ? 'Prix abordables dès 5 DT' : 'Affordable from 5 DT'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-eco-500" />
                <span>{isFr ? 'Finition soignée & testée' : 'Quality Guaranteed'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic / 3D Printer Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-3xl bg-surface-light border-2 border-charcoal-black p-6 shadow-2xl">
              {/* Top Card Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-eco-500" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-eco-500 bg-eco-50 px-2 py-0.5 rounded-full">
                  Atelier Fabrication 3D
                </span>
              </div>

              {/* Hardware visual */}
              <div className="relative my-4 aspect-4/3 rounded-2xl overflow-hidden bg-surface-subtle border border-surface-border">
                <img
                  src="/images/cbv-showcase.jpg"
                  alt="CBV-3D PRINTING Workshop Showcase"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="text-xs font-semibold text-eco-300 uppercase tracking-widest">
                      Eco Additive Hub
                    </p>
                    <p className="text-lg font-bold">CBV-3D PRINTING Emblem</p>
                  </div>
                </div>
              </div>

              {/* Quick specs grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-surface-border">
                  <span className="text-[10px] text-charcoal-subtle block font-semibold uppercase">Prix Dès</span>
                  <span className="text-xs font-bold text-eco-500">5 DT</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-surface-border">
                  <span className="text-[10px] text-charcoal-subtle block font-semibold uppercase">Délais</span>
                  <span className="text-xs font-bold text-charcoal">24–48h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-surface-border">
                  <span className="text-[10px] text-charcoal-subtle block font-semibold uppercase">Sur-Mesure</span>
                  <span className="text-xs font-bold text-eco-500">100% Libre</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
