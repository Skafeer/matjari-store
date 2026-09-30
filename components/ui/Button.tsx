// components/ui/Button.tsx
'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-6 text-[15px] gap-2.5 rounded-xl',
};

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white hover:opacity-95 active:scale-[0.98] shadow-[0_4px_12px_-4px_rgba(12,102,121,0.4)]',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98]',
  outline:
    'border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-light)] active:scale-[0.98]',
  ghost:
    'text-gray-700 hover:bg-gray-100 active:scale-[0.98]',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-[0_4px_12px_-4px_rgba(239,68,68,0.4)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-bold
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري التحميل...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);