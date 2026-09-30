// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Package, Check } from 'lucide-react';
import { getFirstImage, fmt } from '@/lib/format';
import { addToCart } from '@/lib/cart';

interface ProductCardProps {
  item: any;
  code: string;
}

export default function ProductCard({ item, code }: ProductCardProps) {
  const product = item.product;
  const img = getFirstImage(product);
  const [added, setAdded] = useState(false);

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? item.price * (1 - product.discount / 100)
    : item.price;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(code, {
      productId: product.id,
      name: product.name,
      imageUrl: img || '',
      price: finalPrice,
      quantity: 1,
      stock: product.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out flex flex-col overflow-hidden">

      <Link
        href={`/${code}/product/${item.productId}`}
        className="flex flex-col flex-1"
      >
        {/* Image */}
        <div className="aspect-square bg-white relative overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Package className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
            </div>
          )}

          {hasDiscount && (
            <div
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg text-white text-[10px] font-bold shadow-sm tabular-nums"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              -{product.discount}%
            </div>
          )}

          {isLowStock && !isOutOfStock && (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-sm">
              متبقي {product.stock}
            </div>
          )}

          {product.isRenewable && !isOutOfStock && (
            <div
              className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm"
              style={{
                backgroundColor: 'var(--color-brand-light)',
                color: 'var(--color-brand-dark)',
              }}
            >
              قابل للتجديد
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-gray-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                نفد المخزون
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-3.5 pt-3.5 pb-1 flex-1">
          <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[2.3rem]">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* Bottom */}
      <div className="px-3.5 pb-3.5 pt-2 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1 min-w-0 flex-wrap">
          <span className="text-base md:text-[17px] font-bold text-gray-900 tabular-nums leading-none tracking-tight">
            {fmt(finalPrice)}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">د.ع</span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through tabular-nums leading-none">
              {fmt(item.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:opacity-95"
          style={{ backgroundColor: 'var(--color-brand)' }}
          aria-label="أضف إلى السلة"
        >
          {added ? (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          ) : (
            <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </div>
  );
}
