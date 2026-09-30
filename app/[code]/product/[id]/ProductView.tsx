// app/[code]/product/[id]/ProductView.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ShoppingBag, Minus, Plus, Package, Check,
  ChevronLeft, ChevronRight, Truck, Shield, RefreshCw,
  ShoppingCart,
} from 'lucide-react';
import { getAllImages, fmt } from '@/lib/format';
import { addToCart, setCartItem } from '@/lib/cart';

export default function ProductView({
  data,
  code,
}: {
  data: { store: any; item: any };
  code: string;
}) {
  const router = useRouter();
  const product = data.item.product;
  const storePrice = data.item.price;
  const images = getAllImages(product);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? storePrice * (1 - product.discount / 100)
    : storePrice;

  const outOfStock = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);

  const cartItem = {
    productId: product.id,
    name: product.name,
    imageUrl: images[0] || '',
    price: finalPrice,
    quantity: qty,
    stock: product.stock,
  };

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(code, cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    setCartItem(code, cartItem);
    router.push(`/${code}/cart`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-12 md:pb-16">

      {/* ── Back ── */}
      <Link
        href={`/${code}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-5 md:mb-7 transition group"
      >
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        العودة إلى {data.store.name}
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-start">

        {/* ═══════════════════════════════════════════ */}
        {/* ── Image Gallery — responsive ── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="w-full">
          <div className="relative w-full max-w-md mx-auto md:max-w-none">
            {/* Main image — مربع متجاوب */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.08)]">
              {images[activeImg] ? (
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 md:p-6"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 md:w-20 md:h-20 text-gray-300" strokeWidth={1.5} />
                </div>
              )}

              {/* Discount Badge */}
              {hasDiscount && (
                <div
                  className="absolute top-3 right-3 text-white text-xs md:text-sm font-bold px-2.5 py-1 rounded-lg shadow-md tabular-nums"
                  style={{ backgroundColor: 'var(--color-brand)' }}
                >
                  -{product.discount}%
                </div>
              )}

              {/* Out of Stock */}
              {outOfStock && (
                <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-gray-900 text-white text-sm font-bold px-5 py-2 rounded-full shadow-md">
                    نفد المخزون
                  </span>
                </div>
              )}

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImg((i) => (i - 1 + images.length) % images.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all"
                    aria-label="الصورة التالية"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 md:mt-4 overflow-x-auto pb-1 scrollbar-hide justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImg
                        ? 'border-[var(--color-brand)] shadow-md'
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`الصورة ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ── Info ── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="flex flex-col w-full">

          {/* Categories */}
          {product.category && product.category !== 'عام' && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.category
                .split(',')
                .map((c: string) => c.trim())
                .filter(Boolean)
                .map((c: string, i: number) => (
                  <span
                    key={i}
                    className="text-[11px] md:text-xs font-medium px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: 'var(--color-brand-light)',
                      color: 'var(--color-brand-dark)',
                    }}
                  >
                    {c}
                  </span>
                ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2.5 mb-5 flex-wrap">
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tabular-nums tracking-tight">
              {fmt(finalPrice)}
            </span>
            <span className="text-sm md:text-base text-gray-500 font-medium">د.ع</span>
            {hasDiscount && (
              <span className="text-sm md:text-base text-gray-400 line-through tabular-nums">
                {fmt(storePrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                نفد المخزون
              </span>
            ) : product.stock < 5 ? (
              <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                متبقي {product.stock} قطعة فقط
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <Check className="w-3.5 h-3.5" />
                متوفر في المخزون
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">الوصف</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity */}
          {!outOfStock && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">الكمية</h3>
              <div className="inline-flex items-center gap-2.5 border-2 border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-95"
                  aria-label="إنقاص الكمية"
                >
                  <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <span className="w-10 md:w-12 text-center text-base md:text-lg font-bold tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-95"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* ── Action Buttons — داخل الصفحة ── */}
          {/* ═══════════════════════════════════════════ */}
          <div className="flex flex-col gap-2.5 mt-2">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="w-full h-12 md:h-13 rounded-xl text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.98] shadow-[0_6px_16px_-6px_rgba(12,102,121,0.5)]"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                  تمت الإضافة إلى السلة
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  {outOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="w-full h-11 md:h-12 rounded-xl font-bold text-sm md:text-base border-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-[0.98]"
              style={{
                borderColor: 'var(--color-brand)',
                color: 'var(--color-brand)',
              }}
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              اشترِ الآن
            </button>
          </div>

          {/* ═══════════════════════════════════════════ */}
          {/* ── Features ── */}
          {/* ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-6 pt-6 border-t border-gray-100">
            <Feature icon={<Truck className="w-4 h-4 md:w-5 md:h-5" />} label="توصيل سريع" />
            <Feature icon={<Shield className="w-4 h-4 md:w-5 md:h-5" />} label="دفع عند الاستلام" />
            <Feature icon={<RefreshCw className="w-4 h-4 md:w-5 md:h-5" />} label="إمكانية الإرجاع" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-brand-light)',
          color: 'var(--color-brand)',
        }}
      >
        {icon}
      </div>
      <span className="text-[10px] md:text-[11px] font-semibold text-gray-600 leading-tight">
        {label}
      </span>
    </div>
  );
}