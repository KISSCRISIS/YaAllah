'use client';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/seg-design-system/components/patterns/NavItem';
import { segNavigation } from '@/lib/navigation';

/**
 * App-level navigation list. Wraps the existing NavItem/segNavigation data
 * with real Next.js active-route detection via usePathname. Lives at the
 * application layer (not in seg-design-system) since it depends on
 * next/navigation, which the design package intentionally has no knowledge of.
 */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {segNavigation.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          iconLabel={item.iconLabel}
          active={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
        />
      ))}
    </>
  );
}
