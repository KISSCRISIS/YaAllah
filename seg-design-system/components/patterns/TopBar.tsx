import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

// Navigation targets/permissions are supplied by the consumer at SEG
// integration time — this component has no route or auth awareness.
export interface TopBarProps {
  start?: ReactNode;
  end?: ReactNode;
  className?: string;
}

export function TopBar({ start, end, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between gap-4 border-b border-seg-border bg-seg-surface px-4 backdrop-blur-seg-glass sm:px-6',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">{start}</div>
      <div className="flex items-center gap-3" aria-label="Account and notifications">{end}</div>
    </header>
  );
}
