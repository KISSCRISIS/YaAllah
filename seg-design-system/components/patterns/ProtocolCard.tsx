import { GlassPanel } from '../primitives/GlassPanel';
import { Badge } from '../primitives/Badge';
import { ProgressBar } from '../primitives/ProgressBar';
import { cn } from '../utils/cn';

export interface ProtocolCardProps {
  title: string;
  description?: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  className?: string;
}

const statusTone = { 'not-started': 'neutral', 'in-progress': 'primary', completed: 'primary' } as const;
const statusLabel = { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Completed' };

export function ProtocolCard({ title, description, progress, status, className }: ProtocolCardProps) {
  return (
    <GlassPanel className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-seg-text-primary">{title}</h3>
        <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
      </div>
      {description && <p className="text-xs text-seg-text-secondary">{description}</p>}
      <ProgressBar value={progress} />
    </GlassPanel>
  );
}
