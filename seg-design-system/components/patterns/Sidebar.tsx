import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

// Navigation targets/permissions are supplied by the consumer at SEG
// integration time — this component has no route or auth awareness.
export interface SidebarProps {
  brand?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Sidebar({ brand, footer, children, className }: SidebarProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex h-full w-16 flex-col justify-between border-e border-seg-border bg-seg-surface backdrop-blur-seg-glass md:w-64',
        className
      )}
    >
      <div>
        {brand && <div className="px-4 py-5">{brand}</div>}
        <div className="flex flex-col gap-1 px-2">{children}</div>
      </div>
      {footer && <div className="px-2 py-4">{footer}</div>}
    </nav>
  );
}
