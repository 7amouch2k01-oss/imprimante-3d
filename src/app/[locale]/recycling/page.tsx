import React from 'react';
import type { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { RecyclingTeaser } from '@/components/recycling/RecyclingTeaser';
import { Recycle, ArrowDownCircle, Check, Factory, Scale, RefreshCw } from 'lucide-react';

interface RecyclingPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({
  params,
}: RecyclingPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  return {
    title: dictionary.recycling.badge || 'Recycling & Circular Polymer Initiative',
    description: dictionary.recycling.heroSubtitle,
  };
}

export default async function RecyclingPage({ params }: RecyclingPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <div className="space-y-16 sm:space-y-20 py-10 pb-20">
      {/* Top Banner Notice */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Recycle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              {params.locale === 'fr'
                ? 'Ce programme est actuellement en phase de test pilote. Inscrivez-vous pour recevoir votre kit de collecte gratuit.'
                : 'This program is currently in active development / pilot testing. Register below to receive your free collection box.'}
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-200 text-amber-900 rounded-lg">
            {dictionary.nav.comingSoon || 'Coming Soon'}
          </span>
        </div>
      </div>

      {/* Main Interactive Waitlist Teaser View */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <RecyclingTeaser locale={params.locale} dictionary={dictionary} compact={false} />
      </div>

      {/* 3-Step Circular Process Explainer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-eco-50 text-eco-500 border border-eco-200">
            <Recycle className="w-3.5 h-3.5" />
            <span>Circular Lifecycle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-black tracking-tight">
            {dictionary.recycling.howItWorks || 'How the Circular Loop Operates'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto">
            {params.locale === 'fr'
              ? 'Transformer vos déchets d’impression en filaments réutilisables n’a jamais été aussi simple.'
              : 'Turning your waste prints into certified re-extruded spools is seamless and automated.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
            <span className="w-9 h-9 rounded-xl bg-eco-500 text-white font-black text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-charcoal">
              {dictionary.recycling.step1Title}
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {dictionary.recycling.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
            <span className="w-9 h-9 rounded-xl bg-eco-500 text-white font-black text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-base text-charcoal">
              {dictionary.recycling.step2Title}
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {dictionary.recycling.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-surface-subtle border border-surface-border space-y-3">
            <span className="w-9 h-9 rounded-xl bg-eco-500 text-white font-black text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-base text-charcoal">
              {dictionary.recycling.step3Title}
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {dictionary.recycling.step3Desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
