export interface NavigationItem {
  href: string;
  label: string;
  iconLabel: string;
}

// Real navigation config for the approved SEG routes.
// Active-state resolution (e.g. via usePathname) happens wherever this is
// consumed — this file is data only, no component logic.
export const segNavigation: NavigationItem[] = [
  { href: '/dashboard', label: 'Dashboard', iconLabel: 'Dashboard' },
  { href: '/pathway', label: 'Pathway', iconLabel: 'Pathway' },
  { href: '/learn', label: 'Learn', iconLabel: 'Learn' },
  { href: '/practice', label: 'Practice', iconLabel: 'Practice' },
  { href: '/drug-reference', label: 'Drug Reference', iconLabel: 'Drug Reference' },
  { href: '/journal', label: 'Journal', iconLabel: 'Journal' },
];
