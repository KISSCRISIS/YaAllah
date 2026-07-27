import { GlassPanel } from '../primitives/GlassPanel';
import { IconPlaceholder } from '../primitives/IconPlaceholder';
import { cn } from '../utils/cn';

export interface StatCardProps {
  label: string;
  value: string;
  iconLabel: string;
  tone?: 'neutral' | 'primary' | 'emergency';
  className?: string;
}

const toneClasses = {
  neutral: 'bg-seg-text-secondary/15 text-seg-text-secondary',
  primary: 'bg-seg-primary/15 text-seg-primary',
  emergency: 'bg-seg-emergency/15 text-seg-emergency',
};

export function StatCard({ label, value, iconLabel, tone = 'primary', className }: StatCardProps) {
  return (
    <GlassPanel className={cn('flex items-center gap-4', className)} aria-label={`${label}: ${value}`}>
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-seg-md', toneClasses[tone])}>
        <IconPlaceholder label={iconLabel} />
      </span>
      <div>
        <p className="text-sm text-seg-text-secondary">{label}</p>
        <p className="text-xl font-semibold text-seg-text-primary">{value}</p>
      </div>
    </GlassPanel>
  );
}
