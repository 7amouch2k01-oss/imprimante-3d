import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { db } from '@/lib/db';
import { ProductType } from '@/lib/types/product';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: { locale: Locale; slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { translations: true },
  });

  if (!product) return { title: 'Product Not Found' };

  let t = product.translations.find((tr) => tr.languageCode === params.locale);
  if (!t) t = product.translations.find((tr) => tr.languageCode === 'en') || product.translations[0];

  return {
    title: `${t?.name || product.slug} | CBV-3D PRINTING`,
    description: t?.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const dictionary = await getDictionary(params.locale);

  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { translations: true },
  });

  if (!product) {
    notFound();
  }

  let t = product.translations.find((tr) => tr.languageCode === params.locale);
  if (!t) t = product.translations.find((tr) => tr.languageCode === 'en') || product.translations[0];

  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(product.images);
  } catch {
    parsedImages = product.images ? [product.images] : [];
  }

  let parsedSpecs: Record<string, any> = {};
  if (t?.specs) {
    try {
      parsedSpecs = JSON.parse(t.specs);
    } catch {
      parsedSpecs = {};
    }
  }

  const productItem: ProductType = {
    id: product.id,
    slug: product.slug,
    price: product.price,
    comparePrice: product.comparePrice,
    stock: product.stock,
    category: product.category,
    featured: product.featured,
    images: parsedImages,
    name: t?.name || product.slug,
    description: t?.description || '',
    specs: parsedSpecs,
    technology: parsedSpecs.technology || (product.category === 'PRINTER' ? 'FDM' : 'Hardware'),
    speed: parsedSpecs.speed || parsedSpecs.printSpeed,
    buildVolume: parsedSpecs.buildVolume || parsedSpecs.volume,
    brand: parsedSpecs.brand || 'CBV Industrial',
  };

  return (
    <ProductDetailClient
      product={productItem}
      locale={params.locale}
      dictionary={dictionary}
    />
  );
}
