'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Currency = 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInEur: number) => string;
  exchangeRate: number; // 1 EUR in USD
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static conversion rate for demonstration (1 EUR = 1.08 USD)
const EUR_TO_USD_RATE = 1.08;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EUR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cbv_currency') as Currency;
      if (stored === 'USD' || stored === 'EUR') {
        setCurrencyState(stored);
      }
    } catch (e) {
      // Ignore localstorage errors in restricted context
    }
    setMounted(true);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('cbv_currency', newCurrency);
    } catch (e) {}
  };

  const formatPrice = (amountInEur: number): string => {
    if (currency === 'USD') {
      const usd = amountInEur * EUR_TO_USD_RATE;
      return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `€${amountInEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        exchangeRate: EUR_TO_USD_RATE,
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
