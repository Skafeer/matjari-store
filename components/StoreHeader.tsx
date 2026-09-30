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
  const [scrolled, setScrolled] = useState(false);

  // ── Cart count ──
  useEffect(() => {
    const update = () => setCount(getCartCount(code));
    update();

    window.addEventListener('cart-updated', update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('storage', update);
    };
  }, [code]);

  // ── Scroll shadow ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-gray-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-3">

        {/* ─── Logo + Name ─── */}
        <Link
          href={`/${code}`}
          className="flex items-center gap-3 min-w-0 group"
        >
          <div
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: 'var(--color-brand-light)' }}
          >
            <StoreIcon
              className="w-5 h-5 md:w-[22px] md:h-[22px] transition-transform duration-300 group-hover:rotate-[-6deg]"
              style={{ color: 'var(--color-brand)' }}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-bold text-[15px] md:text-base text-gray-900 truncate leading-tight tracking-tight">
              {store.name}
            </h1>
            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
              متجر إلكتروني
            </p>
          </div>
        </Link>

        {/* ─── Cart ─── */}
        <Link
          href={`/${code}/cart`}
          className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-gray-50 active:scale-95 group"
          aria-label="عرض السلة"
        >
          <ShoppingBag
            className="w-[22px] h-[22px] transition-transform duration-300 group-hover:-rotate-6"
            style={{ color: 'var(--color-brand)' }}
            strokeWidth={2}
          />

          {count > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[20px] h-5 px-1.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-scale-in tabular-nums"
              style={{ backgroundColor: '#ef4444' }}
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}