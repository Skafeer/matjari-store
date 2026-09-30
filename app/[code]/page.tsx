// app/[code]/page.tsx
import { notFound } from 'next/navigation';
import { getStorePublic } from '@/lib/data';
import StoreProducts from '@/components/StoreProducts';
import { Package } from 'lucide-react';

export default async function StoreHomePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const data = await getStorePublic(code);

  if (!data) notFound();

  const { products } = data;

  if (!products || products.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 md:px-6 py-20 md:py-28 text-center animate-fade-in">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-brand-light)' }}
        >
          <Package
            className="w-12 h-12"
            style={{ color: 'var(--color-brand)' }}
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          لا توجد منتجات بعد
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
          يتم تجهيز المتجر حالياً — عُد إلينا قريباً لاكتشاف المنتجات الجديدة
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-6 pt-8 md:pt-12 pb-4">
      <StoreProducts products={products} code={code} />
    </div>
  );
}