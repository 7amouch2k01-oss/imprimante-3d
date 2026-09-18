import React from 'react';
import type { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { CheckoutView } from '@/components/checkout/CheckoutView';

interface CheckoutPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  return {
    title: dictionary.checkout.title || 'Checkout',
    description: 'Complete your order with CBV-3D PRINTING.',
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const dictionary = await getDictionary(params.locale);

  return <CheckoutView locale={params.locale} dictionary={dictionary} />;
}
