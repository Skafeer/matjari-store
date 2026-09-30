// components/ui/Card.tsx
'use client';

import { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
};

const variantClasses = {
  default: 'bg-white border border-gray-100',
  elevated: 'bg-white border border-gray-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)]',
  flat: 'bg-gray-50 border border-transparent',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'default',
    padding = 'md',
    className = '',
    children,
    ...rest
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`
        rounded-2xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
});