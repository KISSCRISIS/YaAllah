import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { IconPlaceholder } from '../primitives/IconPlaceholder';

// Navigation targets/permissions are supplied by the consumer at SEG
// integration time — this component has no route or auth awareness.
export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  iconLabel: string;
  active?: boolean;
}

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { label, iconLabel, active, className, ...props }, ref
) {
  return (
    <a
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-seg-md px-3 py-2 text-sm font-medium transition-colors duration-seg-fast ease-seg-standard',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary',
        active ? 'bg-seg-primary/15 text-seg-primary' : 'text-seg-text-secondary hover:bg-seg-surface hover:text-seg-text-primary',
        className
      )}
      {...props}
    >
      <IconPlaceholder label={iconLabel} />
      <span className="hidden md:inline">{label}</span>
    </a>
  );
});
