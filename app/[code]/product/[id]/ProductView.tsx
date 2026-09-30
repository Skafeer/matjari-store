// app/[code]/product/[id]/ProductView.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ShoppingBag, Minus, Plus, Package, Check,
  ChevronLeft, ChevronRight, Truck, Shield, RefreshCw,
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
    <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12 pb-28 md:pb-16">

      {/* ═══════════════════════════════════════════════ */}
      {/* ── Back ── */}
      {/* ═══════════════════════════════════════════════ */}
      <Link
        href={`/${code}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 md:mb-10 transition group"
      >
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        العودة إلى {data.store.name}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">

        {/* ═══════════════════════════════════════════════ */}
        {/* ── Images Gallery ── */}
        {/* ═══════════════════════════════════════════════ */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative border border-gray-100">
            {images[activeImg] ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-gray-300" strokeWidth={1.5} />
              </div>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <div
                className="absolute top-4 right-4 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-md tabular-nums"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                -{product.discount}%
              </div>
            )}

            {/* Out of Stock Overlay */}
            {outOfStock && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md">
                  نفد المخزون
                </span>
              </div>
            )}

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg
                      ? 'border-[var(--color-brand)] shadow-md'
                      : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`الصورة ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* ── Info ── */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="flex flex-col">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Categories */}
          {product.category && product.category !== 'عام' && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.category
                .split(',')
                .map((c: string) => c.trim())
                .filter(Boolean)
                .map((c: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1 rounded-lg"
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

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl md:text-4xl font-bold text-gray-900 tabular-nums tracking-tight">
              {fmt(finalPrice)}
            </span>
            <span className="text-base text-gray-500 font-medium">د.ع</span>
            {hasDiscount && (
              <span className="text-base text-gray-400 line-through tabular-nums">
                {fmt(storePrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-8">
            {outOfStock ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 px-3.5 py-2 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                نفد المخزون
              </span>
            ) : product.stock < 5 ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 px-3.5 py-2 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                متبقي {product.stock} قطعة فقط
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl">
                <Check className="w-4 h-4" />
                متوفر في المخزون
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">الوصف</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity */}
          {!outOfStock && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">الكمية</h3>
              <div className="inline-flex items-center gap-3 border-2 border-gray-200 rounded-2xl p-1.5">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-95"
                  aria-label="إنقاص الكمية"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-bold tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-95"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Desktop buttons */}
          <div className="hidden md:flex flex-col gap-3 mt-auto">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.98] shadow-[0_8px_20px_-8px_rgba(12,102,121,0.5)]"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={3} />
                  تمت الإضافة
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  {outOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="h-12 rounded-2xl font-bold text-sm border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-[0.98]"
              style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}
            >
              اشترِ الآن
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-gray-100">
              <Feature icon={<Truck className="w-5 h-5" />} label="توصيل سريع" />
              <Feature icon={<Shield className="w-5 h-5" />} label="دفع عند الاستلام" />
              <Feature icon={<RefreshCw className="w-5 h-5" />} label="إمكانية الإرجاع" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* ── Mobile Sticky Bar ── */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-3 shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.08)] z-50">
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 h-12 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" strokeWidth={3} /> تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> أضف للسلة
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="h-12 px-5 rounded-2xl font-bold text-sm border-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}
          >
            اشترِ الآن
          </button>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-brand-light)',
          color: 'var(--color-brand)',
        }}
      >
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </div>
  );
}