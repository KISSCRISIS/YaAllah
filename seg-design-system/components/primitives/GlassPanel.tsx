import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
}
const paddingClasses = { none: 'p-0', sm: 'p-3', md: 'p-4 sm:p-6', lg: 'p-6 sm:p-8' };

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { padding = 'md', elevated = false, className, children, ...props }, ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-seg-lg border border-seg-border bg-seg-surface backdrop-blur-seg-glass',
        elevated ? 'shadow-seg-lg' : 'shadow-seg-md',
        paddingClasses[padding], className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
