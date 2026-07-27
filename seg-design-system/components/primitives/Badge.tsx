import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type BadgeTone = 'primary' | 'emergency' | 'warning' | 'neutral';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { tone?: BadgeTone }
const toneClasses: Record<BadgeTone, string> = {
  primary: 'bg-seg-primary/15 text-seg-primary',
  emergency: 'bg-seg-emergency/15 text-seg-emergency',
  warning: 'bg-seg-warning/15 text-seg-warning',
  neutral: 'bg-seg-text-secondary/15 text-seg-text-secondary',
};

export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span role="status" className={cn('inline-flex items-center rounded-seg-full px-2.5 py-0.5 text-xs font-medium', toneClasses[tone], className)} {...props}>
      {children}
    </span>
  );
}
