// components/ProductCard.tsx
import Link from 'next/link';
import { Package } from 'lucide-react';
import { getFirstImage, fmt } from '@/lib/format';

export default function ProductCard({
  item,
  code,
}: {
  item: any;
  code: string;
}) {
  const product = item.product;
  const img = getFirstImage(product);

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? item.price * (1 - product.discount / 100)
    : item.price;

  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <Link
      href={`/${code}/product/${item.productId}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm">
            -{product.discount}%
          </div>
        )}

        {/* Low Stock */}
        {isLowStock && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            متبقي {product.stock}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-[13px] md:text-sm font-bold text-gray-900 line-clamp-2 leading-snug min-h-[2.4rem]">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1">
            <span
              className="text-lg md:text-xl font-black"
              style={{ color: 'var(--color-brand)' }}
            >
              {fmt(finalPrice)}
            </span>
            <span className="text-[11px] text-gray-400 font-semibold">د.ع</span>
          </div>

          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through">
              {fmt(item.price)} د.ع
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}