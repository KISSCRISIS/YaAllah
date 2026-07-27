import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ListItemProps {
  leading?: ReactNode;
  title: string;
  meta?: string;
  trailing?: ReactNode;
  className?: string;
}

export function ListItem({ leading, title, meta, trailing, className }: ListItemProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-seg-md px-3 py-2.5 hover:bg-seg-surface', className)}>
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-seg-text-primary">{title}</p>
        {meta && <p className="truncate text-xs text-seg-text-secondary">{meta}</p>}
      </div>
      {trailing}
    </div>
  );
}
