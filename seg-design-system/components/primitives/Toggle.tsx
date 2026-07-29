import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: ToggleSize;
}

const trackSizeClasses: Record<ToggleSize, string> = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
};

const thumbSizeClasses: Record<ToggleSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

const thumbTranslateClasses: Record<ToggleSize, string> = {
  sm: 'peer-checked:translate-x-4',
  md: 'peer-checked:translate-x-5',
};

/**
 * Toggle/Switch primitive. On/off preference control for settings-style
 * rows (Privacy Controls, Notification Preferences, Theme preference).
 *
 * Built on a visually-hidden native checkbox (`role="switch"`) so keyboard,
 * screen-reader, and form semantics come from the native element for free.
 * The track/thumb are decorative siblings driven by Tailwind's `peer`
 * state - label/id wiring follows the same convention as Input.tsx.
 *
 * Reuses existing tokens only: seg-border/seg-primary/seg-surface colors,
 * rounded-seg-full radius, duration-seg-fast + ease-seg-standard motion.
 * No new design tokens introduced.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, size = 'md', id, className, disabled, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-center gap-2.5',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        className
      )}
    >
      <span className="relative inline-flex shrink-0 items-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        {/* Track */}
        <span
          aria-hidden="true"
          className={cn(
            'rounded-seg-full bg-seg-border transition-colors duration-seg-fast ease-seg-standard',
            'peer-checked:bg-seg-primary',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-seg-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-seg-canvas',
            'motion-reduce:transition-none',
            trackSizeClasses[size]
          )}
        />
        {/* Thumb */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-0.5 top-1/2 -translate-y-1/2 rounded-seg-full border border-seg-border bg-seg-surface shadow-seg-sm transition-transform duration-seg-fast ease-seg-standard',
            'motion-reduce:transition-none',
            thumbSizeClasses[size],
            thumbTranslateClasses[size]
          )}
        />
      </span>
      {label && <span className="text-sm font-medium text-seg-text-primary">{label}</span>}
    </label>
  );
});
