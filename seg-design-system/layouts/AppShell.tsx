import { type ReactNode } from 'react';
import { Sidebar } from '../components/patterns/Sidebar';
import { TopBar } from '../components/patterns/TopBar';

export function AppShell({
  nav, topBarStart, topBarEnd, children,
}: { nav: ReactNode; topBarStart?: ReactNode; topBarEnd?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-screen bg-seg-canvas text-seg-text-primary">
      <Sidebar>{nav}</Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar start={topBarStart} end={topBarEnd} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
