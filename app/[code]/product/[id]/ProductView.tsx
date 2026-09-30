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
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-10">
      <Link
        href={`/${code}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
      >
        <ArrowRight className="w-4 h-4" />
        العودة إلى {data.store.name}
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* ─── Images ─── */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 relative border border-gray-100">
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

            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-md">
                -{product.discount}%
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition"
                  aria-label="السابق"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition"
                  aria-label="التالي"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    i === activeImg
                      ? 'border-[var(--color-brand)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Info ─── */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
            {product.name}
          </h1>

          {product.category && product.category !== 'عام' && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.category
                .split(',')
                .map((c: string) => c.trim())
                .filter(Boolean)
                .map((c: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg"
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

          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="text-3xl md:text-4xl font-black"
              style={{ color: 'var(--color-brand)' }}
            >
              {fmt(finalPrice)}
            </span>
            <span className="text-base text-gray-500 font-bold">د.ع</span>
            {hasDiscount && (
              <span className="text-base text-gray-400 line-through">
                {fmt(storePrice)} د.ع
              </span>
            )}
          </div>

          <div className="mb-6">
            {outOfStock ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                نفد المخزون
              </span>
            ) : product.stock < 5 ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                متبقي {product.stock} قطعة فقط
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <Check className="w-4 h-4" />
                متوفر في المخزون
              </span>
            )}
          </div>

          {product.description && (
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">الوصف</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {!outOfStock && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">الكمية</h3>
              <div className="inline-flex items-center gap-3 border-2 border-gray-200 rounded-2xl p-1.5">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center transition"
                  aria-label="نقص"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-black">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center transition"
                  aria-label="زيادة"
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
              className="h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
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
              className="h-12 rounded-2xl font-bold text-sm border-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}
            >
              اشترِ الآن
            </button>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
              <Feature icon={<Truck className="w-5 h-5" />} label="توصيل سريع" />
              <Feature icon={<Shield className="w-5 h-5" />} label="دفع عند الاستلام" />
              <Feature icon={<RefreshCw className="w-5 h-5" />} label="إمكانية الإرجاع" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 shadow-2xl z-50">
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 h-12 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> أضف للسلة
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="h-12 px-5 rounded-2xl font-bold text-sm border-2 transition disabled:opacity-50"
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