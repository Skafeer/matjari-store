// components/StoreProducts.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, X, Package } from 'lucide-react';
import ProductCard from './ProductCard';

export default function StoreProducts({
  products,
  code,
}: {
  products: any[];
  code: string;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      p.product.name.toLowerCase().includes(q)
    );
  }, [products, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      {/* ═══════════════════════════════════════════ */}
      {/* ── Search ── */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-10 md:mb-14">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتجات..."
            className="w-full h-12 pr-12 pl-12 rounded-full border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all"
            dir="rtl"
          />

          {/* Clear button */}
          {hasQuery && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-90"
              aria-label="مسح البحث"
            >
              <X className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Search results count */}
        {hasQuery && (
          <p className="text-xs text-gray-500 text-center mt-3 animate-fade-in tabular-nums">
            {filtered.length > 0 ? (
              <>
                <span className="font-bold text-gray-900">{filtered.length}</span>
                {' '}نتيجة
              </>
            ) : (
              'لا توجد نتائج'
            )}
          </p>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ── Products / Empty ── */}
      {/* ═══════════════════════════════════════════ */}
      {filtered.length === 0 ? (
        <EmptySearch query={query} onClear={() => setQuery('')} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-12 md:mb-16">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
            >
              <ProductCard item={item} code={code} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// ── Empty Search State ──
// ═══════════════════════════════════════════
function EmptySearch({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="text-center py-16 md:py-20 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
        <Package className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        لا توجد نتائج
      </h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
        لم نجد منتجات تطابق{' '}
        <span className="font-semibold text-gray-700">"{query}"</span>
      </p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
        style={{
          backgroundColor: 'var(--color-brand-light)',
          color: 'var(--color-brand)',
        }}
      >
        <X className="w-4 h-4" />
        إزالة البحث
      </button>
    </div>
  );
}