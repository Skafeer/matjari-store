// components/StoreProducts.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, X, Package, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';

interface Filters {
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface StoreProductsProps {
  products: any[];
  code: string;
}

export default function StoreProducts({ products, code }: StoreProductsProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filterModal, setFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  });

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

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((p: any) =>
        p.product.name.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice) {
      result = result.filter((p: any) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p: any) => p.price <= Number(filters.maxPrice));
    }

    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'stock_desc':
        result.sort(
          (a: any, b: any) => (b.product.stock || 0) - (a.product.stock || 0)
        );
        break;
      case 'stock_asc':
        result.sort(
          (a: any, b: any) => (a.product.stock || 0) - (b.product.stock || 0)
        );
        break;
      default:
        result.sort(
          (a: any, b: any) =>
            new Date(b.product.createdAt).getTime() -
            new Date(a.product.createdAt).getTime()
        );
    }

    return result;
  }, [products, query, activeCategory, filters]);

  const hasQuery = query.trim().length > 0;
  const hasActiveFilters =
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.sortBy !== 'newest';
  const showSectionTitle =
    !hasQuery && !activeCategory && filtered.length > 0;

  return (
    <div>
      {/* ═══════════════════════════════════════════ */}
      {/* ── Search + Filter ── */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-2.5 md:gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
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

          <button
            onClick={() => setFilterModal(true)}
            className={`relative flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl border flex items-center justify-center transition-all hover:opacity-95 active:scale-95 shadow-sm ${
              hasActiveFilters
                ? 'border-transparent'
                : 'border-gray-200 bg-white'
            }`}
            style={
              hasActiveFilters
                ? { backgroundColor: 'var(--color-brand)' }
                : undefined
            }
            aria-label="فلترة"
          >
            <SlidersHorizontal
              className={`w-[18px] h-[18px] ${
                hasActiveFilters ? 'text-white' : 'text-gray-700'
              }`}
            />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
            )}
          </button>
        </div>

        {hasQuery && (
          <p className="text-xs text-gray-500 text-center mt-3 animate-fade-in tabular-nums">
            {filtered.length > 0 ? (
              <>
                <span className="font-bold text-gray-900">{filtered.length}</span>{' '}
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
        <div className="mb-12 md:mb-16">
          <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-hide">
            {/* "الكل" */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
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
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
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
        <div className="flex items-center justify-between mb-5 md:mb-6 px-1">
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
      {/* ── Grid / Empty ── */}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-4 md:mb-8">
          {filtered.map((item: any, idx: number) => (
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

      {/* ── Filter Modal ── */}
      <FilterModal
        open={filterModal}
        onClose={() => setFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={() =>
          setFilters({ minPrice: '', maxPrice: '', sortBy: 'newest' })
        }
      />
    </div>
  );
}

// ═══════════════════════════════════════════
// ── Filter Modal ──
// ═══════════════════════════════════════════
function FilterModal({
  open,
  onClose,
  filters,
  setFilters,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sortOptions = [
    { id: 'newest', label: 'الأحدث' },
    { id: 'price_asc', label: 'السعر: من الأقل للأعلى' },
    { id: 'price_desc', label: 'السعر: من الأعلى للأقل' },
    { id: 'stock_desc', label: 'الأكثر توفراً' },
    { id: 'stock_asc', label: 'الأقل توفراً' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4 animate-fade-in-fast"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 max-h-[88vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">فلترة المنتجات</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all active:scale-90"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-sm font-bold text-gray-900 mb-3 block">
            نطاق السعر (د.ع)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="من"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="flex-1 h-11 px-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-center text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white transition-all"
              dir="ltr"
            />
            <span className="text-gray-400 font-bold">-</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="إلى"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="flex-1 h-11 px-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-center text-gray-900 focus:outline-none focus:border-[var(--color-brand)] focus:bg-white transition-all"
              dir="ltr"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="text-sm font-bold text-gray-900 mb-3 block">
            ترتيب حسب
          </label>
          <div className="space-y-0.5">
            {sortOptions.map((opt) => {
              const selected = filters.sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFilters({ ...filters, sortBy: opt.id })}
                  className="w-full flex items-center gap-3 py-3 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      selected ? 'border-transparent' : 'border-gray-300'
                    }`}
                    style={
                      selected
                        ? { backgroundColor: 'var(--color-brand)' }
                        : undefined
                    }
                  >
                    {selected && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={`text-sm text-right flex-1 ${
                      selected ? 'font-bold text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-5 mt-4 border-t border-gray-100">
          <button
            onClick={onReset}
            className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            إعادة تعيين
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-white font-bold text-sm active:scale-95 transition-all shadow-[0_4px_12px_-4px_rgba(12,102,121,0.4)]"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            تطبيق الفلتر
          </button>
        </div>
      </div>
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
    <div className="text-center py-16 md:py-20 animate-fade-in">
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
          'لا توجد منتجات مطابقة للفلتر'
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