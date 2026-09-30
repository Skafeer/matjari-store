// components/ui/Textarea.tsx
'use client';

import { forwardRef, useId } from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, hint, required, className = '', id, ...rest },
    ref
  ) {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={hasError}
          className={`
            w-full rounded-xl border-2 bg-gray-50 text-sm text-gray-900
            px-3.5 py-3 resize-none transition-all outline-none
            placeholder:text-gray-400
            focus:bg-white
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

        {error && (
          <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>
        )}

        {hint && !error && (
          <p className="text-xs text-gray-400 mt-1.5">{hint}</p>
        )}
      </div>
    );
  }
);