import { cn } from '../utils/cn';

export type DrugStatus = 'available' | 'caution' | 'restricted';
const dotClasses: Record<DrugStatus, string> = {
  available: 'bg-seg-primary',
  caution: 'bg-seg-warning',
  restricted: 'bg-seg-emergency',
};

export function StatusIndicator({ status, label, className }: { status: DrugStatus; label: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-seg-text-secondary', className)}>
      <span className={cn('h-2 w-2 rounded-seg-full', dotClasses[status])} aria-hidden="true" />
      {label}
    </span>
  );
}
