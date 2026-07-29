'use client';

import { useState, type ReactNode } from 'react';
import { AppShell } from '@/seg-design-system/layouts/AppShell';
import { Avatar } from '@/seg-design-system/components/primitives/Avatar';
import { Button } from '@/seg-design-system/components/primitives/Button';
import { AccountPanel } from './Account/AccountPanel';

export interface AccountWorkspaceProviderProps {
  nav: ReactNode;
  children: ReactNode;
}

/**
 * App-layer client wrapper that owns the My Account Workspace
 * open/closed state. Renders AppShell itself so the Avatar trigger
 * (topBarEnd) and the <main> content swap can share one piece of state,
 * without app/(app)/layout.tsx (a Server Component) needing to hold it.
 *
 * My Account is a product section, not a route: opening the workspace
 * swaps the <main> content area for AccountPanel in place - Sidebar and
 * TopBar remain unchanged. This is not a modal/drawer.
 *
 * Avatar.tsx / TopBar.tsx are intentionally route/auth-unaware
 * (per their own design-system comments) and are not modified here -
 * the interactive <button> wrapper and all state live in this app-layer
 * component instead.
 */
export function AccountWorkspaceProvider({ nav, children }: AccountWorkspaceProviderProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  return (
    <AppShell
      nav={nav}
      topBarEnd={
        <button
          type="button"
          onClick={() => setIsWorkspaceOpen(true)}
          aria-label="Open My Account"
          aria-expanded={isWorkspaceOpen}
          className="rounded-seg-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary"
        >
          <Avatar name="SEG User" />
        </button>
      }
    >
      {isWorkspaceOpen ? (
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsWorkspaceOpen(false)}
            className="self-start"
          >
            ← Back
          </Button>
          <AccountPanel />
        </div>
      ) : (
        children
      )}
    </AppShell>
  );
}
