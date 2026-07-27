'use client';
import dynamic from 'next/dynamic';
import { ScreenLayout } from '../../layouts/ScreenLayout';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { Button } from '../../components/primitives/Button';
import { Avatar } from '../../components/primitives/Avatar';
import { Badge } from '../../components/primitives/Badge';
import { IconPlaceholder } from '../../components/primitives/IconPlaceholder';
import { StatCard } from '../../components/patterns/StatCard';
import { ListItem } from '../../components/patterns/ListItem';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { dashboardPlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

export function Dashboard() {
  return (
    <ScreenLayout title="Dashboard" description="Your SEG overview">
      <GlassPanel elevated className="relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-3">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={data.profile.name} size="lg" />
            <div>
              <p className="text-xs text-seg-text-secondary">Welcome back</p>
              <p className="text-lg font-semibold text-seg-text-primary">{data.profile.name}</p>
              <div className="mt-1">
                <Badge tone="primary">{data.profile.role}</Badge>
              </div>
            </div>
          </div>
          <div className="text-start sm:text-end">
            <p className="text-xs text-seg-text-secondary">Command Center</p>
            <p className="text-sm text-seg-text-primary">SEG Emergency Training Overview</p>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel elevated className="col-span-1 flex flex-col items-start gap-3 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-2">
          <IconPlaceholder label="Emergency" />
          <h2 className="text-sm font-semibold text-seg-text-primary">Emergency Access</h2>
        </div>
        <p className="text-sm text-seg-text-secondary">Immediate access to critical emergency protocols.</p>
        <Button variant="emergency" size="lg">Open Emergency Protocols</Button>
      </GlassPanel>

      <StatCard label="Learning progress" value={`${data.learningProgress.value}%`} iconLabel="Learning progress" tone="primary" />

      <GlassPanel className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-seg-text-primary">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Start Practice</Button>
          <Button variant="outline" size="sm">Open Pathway</Button>
          <Button variant="outline" size="sm">Drug Reference</Button>
        </div>
      </GlassPanel>

      <GlassPanel className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-seg-text-primary">Notifications</h2>
        {data.notifications.map((n) => <ListItem key={n.id} title={n.title} meta={n.meta} />)}
      </GlassPanel>

      <GlassPanel className="col-span-1 flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
        <h2 className="text-sm font-semibold text-seg-text-primary">Recent Activity</h2>
        {data.recentActivity.map((item) => <ListItem key={item.id} title={item.title} meta={item.meta} />)}
      </GlassPanel>
    </ScreenLayout>
  );
}
