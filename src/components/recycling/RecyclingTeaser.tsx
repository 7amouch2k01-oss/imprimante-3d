'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { Leaf, Send, CheckCircle2, AlertCircle, Shield, Recycle } from 'lucide-react';

interface RecyclingTeaserProps {
  locale: Locale;
  dictionary: any;
  compact?: boolean;
}

export function RecyclingTeaser({ locale, dictionary, compact = false }: RecyclingTeaserProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg(locale === 'fr' ? 'Veuillez saisir une adresse e-mail valide' : 'Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/recycling-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, languagePref: locale }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-b from-surface-subtle via-white to-surface-subtle shadow-sm ${compact ? 'p-6 sm:p-8' : 'p-8 sm:p-12 lg:p-16'}`}>
      {/* Decorative leaf watermarks */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-eco-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-eco-100 rounded-full blur-3xl pointer-events-none opacity-40" />

      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        {/* Badges */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-eco-50 text-eco-500 border border-eco-200">
          <Leaf className="w-3.5 h-3.5 text-eco-500" />
          <span>{dictionary.recycling.badge || 'Circular Economy Initiative'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-amber-700">{dictionary.nav.comingSoon}</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-black tracking-tight leading-tight">
            {dictionary.recycling.waitlistTitle || 'Join the CBV Recycling Pilot Program'}
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            {dictionary.recycling.waitlistSubtitle || 'Be the first to gain access to circular collection kits, eco-credit drop hubs, and recycled spool launches.'}
          </p>
        </div>

        {/* Subscription Form */}
        <div className="max-w-xl mx-auto pt-2">
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-eco-50 border border-eco-200 text-eco-500 font-semibold text-sm animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-eco-500" />
              <span>{dictionary.recycling.subscribedSuccess}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={dictionary.recycling.emailPlaceholder}
                    disabled={status === 'loading'}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-surface-border focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 bg-white text-sm text-charcoal placeholder-charcoal-subtle outline-none transition-all shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-eco-500 hover:bg-eco-600 disabled:opacity-70 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-none"
                >
                  {status === 'loading' ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Recycle className="w-4 h-4" />
                      <span>{dictionary.recycling.subscribeBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium justify-center pt-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          )}

          <p className="text-[11px] text-charcoal-subtle mt-3 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-eco-500" />
            <span>Zero spam. Direct priority invitation for verified 3D makers and printing farms.</span>
          </p>
        </div>

        {/* Environmental metrics strip */}
        {!compact && (
          <div className="pt-8 border-t border-surface-border/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-surface-light border border-surface-border">
              <span className="text-2xl font-black text-eco-500 block">140 kg</span>
              <span className="text-xs font-semibold text-charcoal">{dictionary.recycling.stat1}</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-light border border-surface-border">
              <span className="text-2xl font-black text-eco-500 block">85%</span>
              <span className="text-xs font-semibold text-charcoal">{dictionary.recycling.stat2}</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-light border border-surface-border">
              <span className="text-2xl font-black text-eco-500 block">100%</span>
              <span className="text-xs font-semibold text-charcoal">{dictionary.recycling.stat3}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
