import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'primary' | 'emergency' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-seg-primary-strong text-seg-on-primary hover:opacity-90 focus-visible:ring-seg-primary',
  emergency: 'bg-seg-emergency text-seg-on-emergency hover:opacity-90 focus-visible:ring-seg-emergency',
  outline: 'border border-seg-border text-seg-text-primary hover:bg-seg-surface focus-visible:ring-seg-primary',
  ghost: 'text-seg-text-primary hover:bg-seg-surface focus-visible:ring-seg-primary',
};
const sizeClasses: Record<ButtonSize, string> = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading, disabled, className, children, ...props }, ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-seg-md font-medium transition-colors duration-seg-fast ease-seg-standard',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-seg-canvas',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant], sizeClasses[size], className
      )}
      {...props}
    >
      {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </button>
  );
});
