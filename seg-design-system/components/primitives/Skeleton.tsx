import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-seg-pulse rounded-seg-md bg-seg-border/60 motion-reduce:animate-none', className)}
      {...props}
    />
  );
}
