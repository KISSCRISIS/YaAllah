import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> { name: string; size?: 'sm' | 'md' | 'lg'; src?: string }
const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' };
const getInitials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');

export function Avatar({ name, size = 'md', src, className, ...props }: AvatarProps) {
  return (
    <div role="img" aria-label={name} className={cn('flex items-center justify-center overflow-hidden rounded-seg-full bg-seg-primary/20 font-semibold text-seg-primary', sizeClasses[size], className)} {...props}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span aria-hidden="true">{getInitials(name)}</span>}
    </div>
  );
}
