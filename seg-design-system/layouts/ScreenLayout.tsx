import { type ReactNode } from 'react';
import { cn } from '../components/utils/cn';

export function ScreenLayout({
  title, description, actions, children, className,
}: { title: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex max-w-6xl flex-col gap-6', className)}>
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-seg-text-primary sm:text-2xl">{title}</h1>
          {description && <p className="text-sm text-seg-text-secondary">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
