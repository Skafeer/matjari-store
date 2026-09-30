// components/ui/Container.tsx
'use client';

import { forwardRef } from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',   // 768px
  md: 'max-w-5xl',   // 1024px
  lg: 'max-w-6xl',   // 1152px ← الافتراضي
  xl: 'max-w-7xl',   // 1280px
  full: 'max-w-none',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ size = 'lg', className = '', children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={`mx-auto px-4 md:px-6 w-full ${sizeClasses[size]} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);