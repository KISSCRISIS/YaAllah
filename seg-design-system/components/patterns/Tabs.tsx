'use client';

import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../utils/cn';

export type TabsVariant = 'segmented' | 'compact';
export type TabsSize = 'sm' | 'md';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the tablist, e.g. "My Account sections". */
  label: string;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  /** Prefix used to build stable tab/panel ids for aria-controls/aria-labelledby. */
  idPrefix?: string;
}

const sizeClasses: Record<TabsSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
};

const containerVariantClasses: Record<TabsVariant, string> = {
  segmented: 'border border-seg-border bg-seg-surface backdrop-blur-seg-glass p-1.5',
  compact: 'border border-transparent bg-transparent p-1',
};

/**
 * Tabs / Segmented Navigation pattern. For switching between sub-sections
 * of a screen (e.g. My Account: Profile/Credentials/Verification/...)
 * without any route change - this is plain internal state, not next/link.
 *
 * Reuses NavItem's active/inactive color logic and GlassPanel's glass
 * container language. Implements the WAI-ARIA Tabs pattern: roving
 * tabIndex, ArrowLeft/ArrowRight/Home/End keyboard navigation (disabled
 * tabs are skipped), aria-selected, aria-controls.
 */
export function Tabs({
  items,
  value,
  onChange,
  label,
  variant = 'segmented',
  size = 'md',
  className,
  idPrefix = 'seg-tab',
}: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndexes = items.reduce<number[]>((acc, item, index) => {
    if (!item.disabled) acc.push(index);
    return acc;
  }, []);

  function focusAndSelect(index: number) {
    onChange(items[index].value);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (enabledIndexes.length === 0) return;
    const currentPos = enabledIndexes.indexOf(currentIndex);

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextPos = (currentPos + direction + enabledIndexes.length) % enabledIndexes.length;
      focusAndSelect(enabledIndexes[nextPos]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusAndSelect(enabledIndexes[0]);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusAndSelect(enabledIndexes[enabledIndexes.length - 1]);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'flex w-full gap-1 overflow-x-auto rounded-seg-lg',
        containerVariantClasses[variant],
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-${item.value}`}
            aria-selected={isActive}
            aria-controls={`${idPrefix}-panel-${item.value}`}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => !item.disabled && onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-seg-md font-medium transition-colors duration-seg-fast ease-seg-standard',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary',
              isActive
                ? 'bg-seg-primary/15 text-seg-primary'
                : 'text-seg-text-secondary hover:bg-seg-border/40 hover:text-seg-text-primary',
              item.disabled && 'pointer-events-none cursor-not-allowed opacity-40',
              sizeClasses[size]
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
