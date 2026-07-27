import type { ReactNode } from 'react';
import { AppShell } from '@/seg-design-system/layouts/AppShell';
import { NavItem } from '@/seg-design-system/components/patterns/NavItem';
import { Avatar } from '@/seg-design-system/components/primitives/Avatar';
import { segNavigation } from '@/lib/navigation';

/**
 * Route group layout for the 6 approved SEG app routes.
 * Composes existing AppShell/Sidebar/TopBar/NavItem/Avatar as-is — no
 * modifications to seg-design-system components. No auth/role logic yet;
 * nav item active-state and account data are placeholders.
 */
export default function AppRouteGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      nav={segNavigation.map((item) => (
        <NavItem key={item.href} href={item.href} label={item.label} iconLabel={item.iconLabel} />
      ))}
      topBarEnd={<Avatar name="SEG User" />}
    >
      {children}
    </AppShell>
  );
}
