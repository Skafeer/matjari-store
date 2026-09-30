// components/StoreHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Store as StoreIcon } from 'lucide-react';
import { getCartCount } from '@/lib/cart';
import { Store } from '@/lib/types';

export default function StoreHeader({
  store,
  code,
}: {
  store: Store;
  code: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCartCount(code));
    update();

    // استمع لأحداث تغيير السلة
    window.addEventListener('cart-updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('storage', update);
    };
  }, [code]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo + Name */}
        <Link href={`/${code}`} className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-brand-light)' }}
          >
            <StoreIcon
              className="w-5 h-5"
              style={{ color: 'var(--color-brand)' }}
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm md:text-base text-gray-900 truncate">
              {store.name}
            </h1>
          </div>
        </Link>

        {/* Cart */}
        <Link
          href={`/${code}/cart`}
          className="relative w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-50 transition"
          aria-label="السلة"
        >
          <ShoppingBag
            className="w-5 h-5"
            style={{ color: 'var(--color-brand)' }}
            strokeWidth={2}
          />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}