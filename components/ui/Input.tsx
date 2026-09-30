// components/ui/Input.tsx
'use client';

import { forwardRef, useId } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      leftIcon,
      required,
      className = '',
      id,
      ...rest
    },
    ref
  ) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={`
              w-full h-11 rounded-xl border-2 bg-gray-50 text-sm text-gray-900
              transition-all outline-none
              placeholder:text-gray-400
              focus:bg-white
              ${leftIcon ? 'pr-10 pl-3' : 'px-3.5'}
              ${
                hasError
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[color:var(--color-brand)]/10'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...rest}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-600 font-medium mt-1.5"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-gray-400 mt-1.5"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);