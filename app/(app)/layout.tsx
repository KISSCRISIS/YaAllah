import type { ReactNode } from 'react';
import { AppShell } from '@/seg-design-system/layouts/AppShell';
import { Avatar } from '@/seg-design-system/components/primitives/Avatar';
import { SidebarNav } from './_components/SidebarNav';

/**
 * Route group layout for the 6 approved SEG app routes.
 * AppShell structure/props are unchanged. Sidebar nav items now come from
 * SidebarNav (client-side active-route detection) instead of being
 * inlined here. No auth/role logic yet; account data is a placeholder.
 */
export default function AppRouteGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      nav={<SidebarNav />}
      topBarEnd={<Avatar name="SEG User" />}
    >
      {children}
    </AppShell>
  );
}
