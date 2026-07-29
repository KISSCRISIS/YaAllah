import type { ReactNode } from 'react';
import { AccountWorkspaceProvider } from './_components/AccountWorkspaceProvider';
import { SidebarNav } from './_components/SidebarNav';

/**
 * Route group layout for the 6 approved SEG app routes.
 * Stays a Server Component - the My Account Workspace open/close state
 * lives in AccountWorkspaceProvider (a client component), which renders
 * AppShell itself so the Avatar entry point and the main-content swap
 * can share state. No auth/role logic yet; account data is a placeholder.
 */
export default function AppRouteGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AccountWorkspaceProvider nav={<SidebarNav />}>
      {children}
    </AccountWorkspaceProvider>
  );
}
