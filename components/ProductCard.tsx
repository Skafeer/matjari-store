// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Package, Check, Images, Heart, Eye } from 'lucide-react';
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
  const [fav, setFav] = useState(false);

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

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav((f) => !f);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out flex flex-col overflow-hidden">

      <Link
        href={`/${code}/product/${item.productId}`}
        className="flex flex-col flex-1"
      >
        {/* ─── Image ─── */}
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

          {/* Renewable Badge — top left */}
          {product.isRenewable && !isOutOfStock && (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-bold shadow-sm">
              قابل للتجديد
            </div>
          )}

          {/* Discount Badge — top right */}
          {hasDiscount && (
            <div
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg text-white text-[10px] font-bold shadow-sm tabular-nums"
              style={{ backgroundColor: 'var(--color-brand)' }}
            >
              -{product.discount}%
            </div>
          )}

          {/* Images Count — bottom left */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/45 text-white text-[10px] font-bold">
              <Images className="w-3 h-3" />
              <span className="tabular-nums">{images.length}</span>
            </div>
          )}

          {/* Favorite — bottom right */}
          <button
            onClick={handleFav}
            className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              fav ? 'bg-white/95' : 'bg-black/30'
            }`}
            aria-label={fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart
              className={`w-4 h-4 ${
                fav ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
              strokeWidth={2}
            />
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-gray-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                نفد المخزون
              </span>
            </div>
          )}
        </div>

        {/* ─── Info ─── */}
        <div className="px-3.5 pt-3.5 pb-2 flex-1">
          {/* Name */}
          <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap mb-2.5">
            <span
              className="text-base font-bold tabular-nums leading-none tracking-tight"
              style={{ color: 'var(--color-brand)' }}
            >
              {fmt(finalPrice)}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--color-brand)' }}
            >
              د.ع
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through tabular-nums leading-none">
                {fmt(item.price)}
              </span>
            )}
          </div>

          {/* Category + Stock */}
          <div className="flex items-center justify-between gap-1.5">
            {firstCategory ? (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate max-w-[80%]"
                style={{
                  backgroundColor: 'var(--color-brand-light)',
                  color: 'var(--color-brand)',
                }}
              >
                {firstCategory}
              </span>
            ) : (
              <span />
            )}
            <span
              className={`text-[10px] font-semibold tabular-nums ${
                isLowStock ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {isLowStock ? '⚠ ' : ''}
              {product.stock}
            </span>
          </div>
        </div>
      </Link>

      {/* ─── Actions: View Details + Add to Cart ─── */}
      <div className="px-3.5 pb-3.5 pt-1 flex items-center gap-2">
        <Link
          href={`/${code}/product/${item.productId}`}
          className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all active:scale-95 hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-brand-light)',
            color: 'var(--color-brand)',
          }}
        >
          <Eye className="w-3.5 h-3.5" />
          عرض التفاصيل
        </Link>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:opacity-95"
          style={{ backgroundColor: 'var(--color-brand)' }}
          aria-label="أضف إلى السلة"
        >
          {added ? (
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          ) : (
            <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </div>
  );
}