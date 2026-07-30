import { type LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Required — ensures every icon has an accessible label */
  'aria-label': string;
}

const sizeClasses = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

export function Icon({ icon: LucideIconComponent, size = 'md', className, 'aria-label': ariaLabel }: IconProps) {
  return (
    <LucideIconComponent
      aria-label={ariaLabel}
      className={cn('shrink-0', sizeClasses[size], className)}
    />
  );
}
