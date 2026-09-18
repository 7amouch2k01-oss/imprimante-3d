import React from 'react';
import type { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { CustomOrderView } from '@/components/custom/CustomOrderView';

interface CustomOrderPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: CustomOrderPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  const isFr = params.locale === 'fr';
  return {
    title: isFr
      ? 'Création 3D Sur-Mesure | CBV 3D PRINTING Tunisie'
      : 'Custom 3D Printing On-Demand | CBV 3D PRINTING Tunisia',
    description: isFr
      ? 'Commandez vos porte-clés, supports téléphone, accessoires gaming et décorations personnalisées imprimées en 3D en Tunisie.'
      : 'Order personalized 3D printed keychains, gaming stands, and custom gifts across Tunisia.',
  };
}

export default async function CustomOrderPage({ params }: CustomOrderPageProps) {
  const dictionary = await getDictionary(params.locale);

  return <CustomOrderView locale={params.locale} dictionary={dictionary} />;
}
