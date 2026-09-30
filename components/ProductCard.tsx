// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Package, Check, Images, Eye } from 'lucide-react';
import { getAllImages, fmt } from '@/lib/format';
import { addToCart } from '@/lib/cart';

interface ProductCardProps {
  item: any;
  code: string;
}

export default function ProductCard({ item, code }: ProductCardProps) {
  const product = item.product;
  const images = getAllImages(product);
  const img = images[0];
  const [added, setAdded] = useState(false);

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? item.price * (1 - product.discount / 100)
    : item.price;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const firstCategory = product.category
    ? product.category
        .split(',')
        .map((c: string) => c.trim())
        .filter((c: string) => c && c !== 'عام')[0]
    : null;

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
    <div className="group bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col overflow-hidden">

      <Link
        href={`/${code}/product/${item.productId}`}
        className="flex flex-col flex-1"
      >
        {/* ─── Image ─── */}
        <div className="aspect-[4/3] bg-white relative overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Package className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
          )}

          {/* Renewable Badge — top left */}
          {product.isRenewable && !isOutOfStock && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-blue-500 text-white text-[9px] font-bold">
              قابل للتجديد
            </div>
          )}

          {/* Discount Badge — top right */}
          {hasDiscount && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-white text-[10px] font-bold tabular-nums"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              -{product.discount}%
            </div>
          )}

          {/* Images Count — bottom left */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 text-white text-[9px] font-bold">
              <Images className="w-3 h-3" />
              <span className="tabular-nums">{images.length}</span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-gray-900 text-white text-[11px] font-bold px-3 py-1 rounded-md">
                نفد المخزون
              </span>
            </div>
          )}
        </div>

        {/* ─── Info ─── */}
        <div className="px-3 pt-3 pb-2 flex-1 flex flex-col">
          {/* Category */}
          {firstCategory && (
            <span
              className="text-[9px] font-semibold self-start px-1.5 py-0.5 rounded mb-1.5 truncate max-w-full"
              style={{
                backgroundColor: 'var(--color-brand-light)',
                color: 'var(--color-brand)',
              }}
            >
              {firstCategory}
            </span>
          )}

          {/* Name */}
          <h3 className="text-[12.5px] font-medium text-gray-800 line-clamp-2 leading-snug mb-2 min-h-[2.2rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[15px] font-bold text-gray-900 tabular-nums leading-none">
              {fmt(finalPrice)}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">د.ع</span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through tabular-nums leading-none">
                {fmt(item.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ─── Actions ─── */}
      <div className="px-3 pb-3 pt-1 flex items-center gap-1.5">
        <Link
          href={`/${code}/product/${item.productId}`}
          className="flex-1 h-8 rounded-md flex items-center justify-center gap-1 text-[11px] font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          التفاصيل
        </Link>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
          style={{ backgroundColor: 'var(--color-brand)' }}
          aria-label="أضف إلى السلة"
        >
          {added ? (
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          ) : (
            <ShoppingCart className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </div>
  );
}