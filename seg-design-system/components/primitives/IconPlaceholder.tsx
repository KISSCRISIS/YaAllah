import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

// Icon library decision: TBD — Requires Approval
export interface IconPlaceholderProps extends HTMLAttributes<HTMLSpanElement> { label: string; size?: 'sm' | 'md' | 'lg' }
const sizeClasses = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

export function IconPlaceholder({ label, size = 'md', className, ...props }: IconPlaceholderProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn('inline-block shrink-0 rounded-seg-sm border border-dashed border-seg-border/80', sizeClasses[size], className)}
      {...props}
    />
  );
}
