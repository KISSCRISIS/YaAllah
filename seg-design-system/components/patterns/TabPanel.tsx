import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TabPanelProps {
  /** This panel's own tab value. */
  value: string;
  /** Currently active tab value from the paired Tabs component. */
  activeValue: string;
  children: ReactNode;
  className?: string;
  /** Must match the idPrefix passed to the paired Tabs component. */
  idPrefix?: string;
}

/**
 * Panel paired with Tabs. Only renders its children when `value` matches
 * the currently active tab. Wires role="tabpanel" / aria-labelledby back
 * to the corresponding tab button rendered by Tabs.
 */
export function TabPanel({ value, activeValue, children, className, idPrefix = 'seg-tab' }: TabPanelProps) {
  if (value !== activeValue) return null;

  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${value}`}
      aria-labelledby={`${idPrefix}-${value}`}
      tabIndex={0}
      className={cn('focus-visible:outline-none', className)}
    >
      {children}
    </div>
  );
}
