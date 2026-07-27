import { GlassPanel } from '../primitives/GlassPanel';
import { StatusIndicator, type DrugStatus } from './StatusIndicator';
import { cn } from '../utils/cn';

export interface DrugCardProps {
  name: string;
  category: string;
  status: DrugStatus;
  statusLabel: string;
  onSelect?: () => void;
  className?: string;
}

export function DrugCard({ name, category, status, statusLabel, onSelect, className }: DrugCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-seg-lg text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary',
        className
      )}
    >
      <GlassPanel className="flex flex-col items-start gap-2 transition-colors duration-seg-fast ease-seg-standard hover:bg-seg-surface/80">
        <p className="text-sm font-semibold text-seg-text-primary">{name}</p>
        <p className="text-xs text-seg-text-secondary">{category}</p>
        <StatusIndicator status={status} label={statusLabel} />
      </GlassPanel>
    </button>
  );
}
