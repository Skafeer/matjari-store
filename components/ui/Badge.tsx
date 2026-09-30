// components/ui/Badge.tsx
'use client';

type Variant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
type Size = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
}

const variantClasses: Record<Variant, string> = {
  brand:
    'bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  neutral: 'bg-gray-100 text-gray-700',
};

const dotColors: Record<Variant, string> = {
  brand: 'bg-[var(--color-brand)]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-gray-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-[10px] px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-bold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...rest}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}