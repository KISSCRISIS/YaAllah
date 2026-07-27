import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> { value: number; label?: string }

export function ProgressBar({ value, label, className, ...props }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('w-full', className)} {...props}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm text-seg-text-secondary">
          <span>{label}</span><span>{clamped}%</span>
        </div>
      )}
      <div role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="h-2 w-full overflow-hidden rounded-seg-full bg-seg-border">
        <div className="h-full rounded-seg-full bg-seg-primary transition-[width] duration-seg-base ease-seg-standard" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
