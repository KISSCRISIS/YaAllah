'use client';

import { useState } from 'react';
import { GlassPanel } from '@/seg-design-system/components/primitives/GlassPanel';
import { EmptyState } from '@/seg-design-system/components/patterns/EmptyState';
import { Tabs, type TabItem } from '@/seg-design-system/components/patterns/Tabs';
import { TabPanel } from '@/seg-design-system/components/patterns/TabPanel';

const ACCOUNT_TAB_ID_PREFIX = 'seg-account-tab';

// The 8 approved My Account sections. My Account is a product section,
// not a standalone route - none of these values are routes or hrefs.
const accountSections: TabItem[] = [
  { value: 'profile', label: 'Profile' },
  { value: 'credentials', label: 'Credentials' },
  { value: 'verification', label: 'Verification' },
  { value: 'privacy', label: 'Privacy' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'progress', label: 'Progress History' },
  { value: 'settings', label: 'Settings' },
  { value: 'subscription', label: 'Subscription' },
];

/**
 * My Account container. Wires the existing Tabs/TabPanel patterns
 * together with placeholder content for each of the 8 approved
 * sub-sections. No section content is implemented yet - each renders
 * an EmptyState placeholder only, per review decision.
 *
 * Not yet wired into any trigger (e.g. TopBar avatar) - this is initial
 * structure only. Existing navigation (SidebarNav/lib/navigation.ts) is
 * unchanged.
 */
export function AccountPanel() {
  const [activeSection, setActiveSection] = useState(accountSections[0].value);

  return (
    <GlassPanel elevated className="flex flex-col gap-6">
      <Tabs
        items={accountSections}
        value={activeSection}
        onChange={setActiveSection}
        label="My Account sections"
        idPrefix={ACCOUNT_TAB_ID_PREFIX}
      />

      {accountSections.map((section) => (
        <TabPanel
          key={section.value}
          value={section.value}
          activeValue={activeSection}
          idPrefix={ACCOUNT_TAB_ID_PREFIX}
        >
          <EmptyState
            iconLabel={section.label}
            title={`${section.label} — coming soon`}
            description="This section of My Account has not been implemented yet."
          />
        </TabPanel>
      ))}
    </GlassPanel>
  );
}
