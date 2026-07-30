import { type ReactNode } from 'react';
import { IconPlaceholder } from '../primitives/IconPlaceholder';
import { cn } from '../utils/cn';

export interface EmptyStateProps {
  /** Required — used as aria-label fallback when no custom icon is supplied */
  iconLabel: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** Optional — custom icon (e.g. <Icon icon={Search} aria-label="Search" />). Falls back to IconPlaceholder. */
  icon?: ReactNode;
}

export function EmptyState({ iconLabel, title, description, action, className, icon }: EmptyStateProps) {
  return (
    <div role="status" className={cn('mx-auto flex max-w-sm flex-col items-center gap-3 py-12 text-center', className)}>
      {icon ?? <IconPlaceholder label={iconLabel} size="lg" />}
      <p className="text-sm font-medium text-seg-text-primary">{title}</p>
      {description && <p className="text-sm text-seg-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
