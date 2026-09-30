// app/[code]/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStoreProductPublic } from '@/lib/data';
import ProductView from './ProductView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string; id: string }>;
}): Promise<Metadata> {
  const { code: rawCode, id: rawId } = await params;
  const data = await getStoreProductPublic(rawCode.toUpperCase(), Number(rawId));
  if (!data) return {};
  return {
    title: `${data.item.product.name} — ${data.store.name}`,
    description: (data.item.product.description || '').slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ code: string; id: string }>;
}) {
  const { code: rawCode, id: rawId } = await params;
  const code = rawCode.toUpperCase();
  const productId = Number(rawId);
  if (!Number.isFinite(productId) || productId <= 0) notFound();

  const data = await getStoreProductPublic(code, productId);
  if (!data) notFound();

  return <ProductView data={data} code={code} />;
}