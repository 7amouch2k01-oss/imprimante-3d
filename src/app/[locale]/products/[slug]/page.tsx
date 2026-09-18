import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { ProductType } from '@/lib/types/product';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: { locale: Locale; slug: string };
}

function resolveSpecs(t: any): Record<string, string> {
  if (!t?.specs) return {};
  if (t.specs instanceof Map) return Object.fromEntries(t.specs);
  return Object.fromEntries(Object.entries(t.specs as Record<string, string>));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    await connectDB();
    const product = await Product.findOne({ slug: params.slug }).lean();
    if (!product) return { title: 'Product Not Found' };

    const t =
      product.translations.find((tr: any) => tr.languageCode === params.locale) ||
      product.translations.find((tr: any) => tr.languageCode === 'en') ||
      product.translations[0];

    return {
      title: `${t?.name || product.slug} | CBV-3D PRINTING`,
      description: t?.description,
    };
  } catch {
    return { title: 'CBV-3D PRINTING' };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const dictionary = await getDictionary(params.locale);

  await connectDB();
  const product = await Product.findOne({ slug: params.slug }).lean();

  if (!product) {
    notFound();
  }

  const t =
    product.translations.find((tr: any) => tr.languageCode === params.locale) ||
    product.translations.find((tr: any) => tr.languageCode === 'en') ||
    product.translations[0];

  const specs = resolveSpecs(t);

  const productItem: ProductType = {
    id: String(product._id),
    slug: product.slug,
    price: product.price,
    comparePrice: product.comparePrice,
    stock: product.stock,
    category: product.category,
    featured: product.featured,
    images: product.images || [],
    name: t?.name || product.slug,
    description: t?.description || '',
    specs,
    technology: specs.technology || (product.category === 'PRINTER' ? 'FDM' : 'Hardware'),
    speed: specs.speed || specs['Print Speed'],
    buildVolume: specs.buildVolume || specs['Build Volume'],
    brand: specs.brand || 'CBV Industrial',
  };

  return (
    <ProductDetailClient
      product={productItem}
      locale={params.locale}
      dictionary={dictionary}
    />
  );
}
