// components/ui/Skeleton.tsx
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  rounded = 'md',
  className = '',
  ...rest
}: SkeletonProps) {
  const radiusMap = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`bg-gray-100 animate-pulse ${radiusMap[rounded]} ${className}`}
      {...rest}
    />
  );
}

// ─── Skeleton للبطاقة منتج ───
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton rounded="sm" className="aspect-square w-full" />
      <div className="p-3 space-y-3">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-3/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton rounded="md" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton لصفحة منتج ───
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
      <Skeleton className="h-4 w-32 mb-8" />
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <Skeleton rounded="lg" className="aspect-square w-full" />
          <div className="flex gap-2.5 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} rounded="md" className="w-16 h-16 md:w-20 md:h-20" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="pt-4">
            <Skeleton rounded="lg" className="h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}