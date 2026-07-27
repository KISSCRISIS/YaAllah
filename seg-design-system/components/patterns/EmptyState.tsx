import { type ReactNode } from 'react';
import { IconPlaceholder } from '../primitives/IconPlaceholder';
import { cn } from '../utils/cn';

export interface EmptyStateProps {
  iconLabel: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ iconLabel, title, description, action, className }: EmptyStateProps) {
  return (
    <div role="status" className={cn('mx-auto flex max-w-sm flex-col items-center gap-3 py-12 text-center', className)}>
      <IconPlaceholder label={iconLabel} size="lg" />
      <p className="text-sm font-medium text-seg-text-primary">{title}</p>
      {description && <p className="text-sm text-seg-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
