// components/StoreProducts.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, X, Package } from 'lucide-react';
import ProductCard from './ProductCard';

interface StoreProductsProps {
  products: any[];
  code: string;
}

export default function StoreProducts({ products, code }: StoreProductsProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // ── استخراج التصنيفات ──
  const productCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p: any) => {
      const productCats: string[] = p.product.category
        ? p.product.category
            .split(',')
            .map((c: string) => c.trim())
            .filter((c: string) => c && c !== 'عام')
        : [];
      productCats.forEach((c) => cats.add(c));
    });
    return Array.from(cats);
  }, [products]);

  // ── الفلترة والترتيب ──
  const filtered = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory) {
      result = result.filter((p: any) => {
        const productCats: string[] = p.product.category
          ? p.product.category
              .split(',')
              .map((c: string) => c.trim())
              .filter(Boolean)
          : [];
        return productCats.includes(activeCategory);
      });
    }

    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((p: any) =>
        p.product.name.toLowerCase().includes(q)
      );
    }

    // Sort by newest (with safety for missing createdAt)
    result.sort((a: any, b: any) => {
      const aTime = a.product?.createdAt
        ? new Date(a.product.createdAt).getTime()
        : 0;
      const bTime = b.product?.createdAt
        ? new Date(b.product.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });

    return result;
  }, [products, query, activeCategory]);

  const hasQuery = query.trim().length > 0;
  const showSectionTitle =
    !hasQuery && !activeCategory && filtered.length > 0;

  return (
    <div className="w-full">
      {/* ═══════════════════════════════════════════ */}
      {/* ── Search ── */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-8 md:mb-10">
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full h-11 md:h-12 pr-11 pl-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all"
            dir="rtl"
          />
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

        {hasQuery && (
          <p className="text-xs text-gray-500 text-center mt-3 animate-fade-in tabular-nums">
            {filtered.length > 0 ? (
              <>
                <span className="font-bold text-gray-900">
                  {filtered.length}
                </span>{' '}
                نتيجة
              </>
            ) : (
              'لا توجد نتائج'
            )}
          </p>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ── Categories ── */}
      {/* ═══════════════════════════════════════════ */}
      {!hasQuery && productCategories.length > 0 && (
        <div className="mb-10 md:mb-14">
          <div className="flex gap-3 overflow-x-auto py-1.5 scrollbar-hide">
            {/* "الكل" */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-7 py-3 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                activeCategory === null
                  ? 'text-white border-transparent shadow-[0_3px_10px_-3px_rgba(12,102,121,0.4)]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              style={
                activeCategory === null
                  ? { backgroundColor: 'var(--color-brand)' }
                  : undefined
              }
            >
              الكل
            </button>

            {/* Categories */}
            {productCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={`flex-shrink-0 px-7 py-3 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                    isActive
                      ? 'text-white border-transparent shadow-[0_3px_10px_-3px_rgba(12,102,121,0.4)]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: 'var(--color-brand)' }
                      : undefined
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ── Section Title ── */}
      {/* ═══════════════════════════════════════════ */}
      {showSectionTitle && (
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1 h-5 rounded-full"
              style={{ backgroundColor: 'var(--color-brand)' }}
              aria-hidden="true"
            />
            <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">
              المنتجات
            </h2>
          </div>
          <span className="text-xs md:text-sm text-gray-500 font-medium tabular-nums">
            {filtered.length} منتج
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ── Products — Flex center (يحل مشكلة الصف الناقص) ── */}
      {/* ═══════════════════════════════════════════ */}
      {filtered.length === 0 ? (
        <EmptyState
          query={query}
          category={activeCategory}
          onClear={() => {
            setQuery('');
            setActiveCategory(null);
          }}
        />
      ) : (
        <div className="w-full flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5 mb-4 md:mb-8">
          {filtered.map((item: any, idx: number) => (
            <div
              key={item.id}
              className="w-[calc(50%-6px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-15px)] animate-fade-in"
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
// ── Empty State ──
// ═══════════════════════════════════════════
function EmptyState({
  query,
  category,
  onClear,
}: {
  query: string;
  category: string | null;
  onClear: () => void;
}) {
  return (
    <div className="w-full text-center py-16 md:py-20 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
        <Package className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
        {query ? (
          <>
            لم نجد منتجات تطابق "
            <span className="font-semibold text-gray-700">{query}</span>"
          </>
        ) : category ? (
          <>
            لا توجد منتجات في فئة "
            <span className="font-semibold text-gray-700">{category}</span>"
          </>
        ) : (
          'لا توجد منتجات'
        )}
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
        إعادة تعيين
      </button>
    </div>
  );
}