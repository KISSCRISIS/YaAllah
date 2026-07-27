import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TimelineItemData {
  id: string;
  title: string;
  meta?: string;
  content?: ReactNode;
  state?: 'completed' | 'current' | 'upcoming';
}

const stateDot = {
  completed: 'bg-seg-primary',
  current: 'bg-seg-primary ring-4 ring-seg-primary/20',
  upcoming: 'bg-seg-border',
};

export function Timeline({ items, className }: { items: TimelineItemData[]; className?: string }) {
  return (
    <ol className={cn('relative border-s border-seg-border ps-6', className)}>
      {items.map((item) => (
        <li key={item.id} className="relative mb-8 last:mb-0">
          <span className={cn('absolute -start-[29px] top-1 h-3 w-3 rounded-seg-full', stateDot[item.state ?? 'upcoming'])} aria-hidden="true" />
          <p className="text-sm font-medium text-seg-text-primary">{item.title}</p>
          {item.meta && <p className="text-xs text-seg-text-secondary">{item.meta}</p>}
          {item.content && <div className="mt-2">{item.content}</div>}
        </li>
      ))}
    </ol>
  );
}
