'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Currency = 'TND' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInTnd: number) => string;
  exchangeRate: number; // 1 TND in EUR (~0.30 EUR)
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static conversion rate for display: 1 TND ≈ 0.30 EUR
const TND_TO_EUR_RATE = 0.30;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('TND');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cbv_currency') as Currency;
      if (stored === 'TND' || stored === 'EUR') {
        setCurrencyState(stored);
      }
    } catch (e) {
      // Ignore localstorage errors
    }
    setMounted(true);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('cbv_currency', newCurrency);
    } catch (e) {}
  };

  const formatPrice = (amountInTnd: number): string => {
    if (currency === 'EUR') {
      const eur = amountInTnd * TND_TO_EUR_RATE;
      return `${eur.toFixed(2)} €`;
    }
    // Tunisian Dinar formatting
    return `${amountInTnd % 1 === 0 ? amountInTnd : amountInTnd.toFixed(1)} DT`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        exchangeRate: TND_TO_EUR_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
