// app/[code]/layout.tsx
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { getStorePublic } from '@/lib/data';
import { getColor } from '@/lib/colors';
import StoreHeader from '@/components/StoreHeader';
import StoreFooter from '@/components/StoreFooter';
import WhatsAppButton from '@/components/WhatsAppButton';

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const data = await getStorePublic(code);

  if (!data) notFound();

  const color = getColor(data.store.color);

  return (
    <div
      dir="rtl"
      style={
        {
          '--color-brand': color.hex,
          '--color-brand-dark': color.dark,
          '--color-brand-light': color.light,
        } as CSSProperties
      }
      className="flex flex-col bg-gray-50 min-h-screen"
    >
      <StoreHeader store={data.store} code={code} />
      <main className="flex-1">{children}</main>
      <StoreFooter store={data.store} />

      {/* ✅ زر واتساب العائم */}
      {data.store.phone && (
        <WhatsAppButton
          phone={data.store.phone}
          storeName={data.store.name}
        />
      )}
    </div>
  );
}