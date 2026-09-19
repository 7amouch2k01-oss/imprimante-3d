'use client';

import React, { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Persist to cookie (valid for 1 year)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Persist to localStorage
    try {
      localStorage.setItem('preferred_locale', newLocale);
    } catch (e) {
      console.warn('Could not persist language to localStorage', e);
    }

    // Replace current locale in URL path
    const segments = pathname.split('/');
    // segments[0] is empty, segments[1] is locale
    segments[1] = newLocale;
    const newPathname = segments.join('/');

    startTransition(() => {
      router.push(newPathname);
      router.refresh();
    });
  };

  return (
    <div className="inline-flex items-center p-1 rounded-lg bg-surface-muted border border-surface-border text-xs font-semibold">
      <button
        type="button"
        onClick={() => handleSwitch('ar')}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-md transition-all duration-150 ${
          currentLocale === 'ar'
            ? 'bg-surface-light text-eco-500 font-bold shadow-sm border border-surface-border'
            : 'text-charcoal-muted hover:text-charcoal hover:bg-surface-subtle'
        }`}
        aria-label="التحويل إلى العربية"
      >
        عربي
      </button>
      <button
        type="button"
        onClick={() => handleSwitch('fr')}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-md transition-all duration-150 ${
          currentLocale === 'fr'
            ? 'bg-surface-light text-eco-500 font-bold shadow-sm border border-surface-border'
            : 'text-charcoal-muted hover:text-charcoal hover:bg-surface-subtle'
        }`}
        aria-label="Passer au Français"
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => handleSwitch('en')}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-md transition-all duration-150 ${
          currentLocale === 'en'
            ? 'bg-surface-light text-eco-500 font-bold shadow-sm border border-surface-border'
            : 'text-charcoal-muted hover:text-charcoal hover:bg-surface-subtle'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
