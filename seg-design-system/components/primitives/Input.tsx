import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, id, className, ...props }, ref) {
  const inputId = id ?? props.name;
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-seg-text-primary">{label}</label>}
      <input
        ref={ref} id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        className={cn(
          'h-10 w-full rounded-seg-md border border-seg-border bg-seg-surface px-3 text-sm text-seg-text-primary placeholder:text-seg-text-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary',
          error && 'border-seg-emergency', className
        )}
        {...props}
      />
      {error && <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-seg-emergency">{error}</p>}
    </div>
  );
});
