// app/[code]/page.tsx
import { notFound } from 'next/navigation';
import { getStorePublic } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
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

  const { store, products } = data;

  if (!products || products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <Package className="w-10 h-10 text-gray-400" strokeWidth={1.8} />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد منتجات</h2>
        <p className="text-gray-500 text-sm">
          سيتم إضافة المنتجات قريباً — عُد لاحقاً
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Hero */}
      <div
        className="rounded-3xl p-6 md:p-10 mb-8 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-brand-light), #ffffff)',
          border: '1px solid rgba(0,0,0,0.03)',
        }}
      >
        <h1
          className="text-2xl md:text-4xl font-black mb-3"
          style={{ color: 'var(--color-brand-dark)' }}
        >
          {store.name}
        </h1>
        {store.description && (
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            {store.description}
          </p>
        )}
        <div
          className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: 'var(--color-brand)',
            color: '#fff',
          }}
        >
          {products.length} منتج متوفر
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {products.map((item: any) => (
          <ProductCard key={item.id} item={item} code={code} />
        ))}
      </div>
    </div>
  );
}