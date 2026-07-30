'use client';
import dynamic from 'next/dynamic';
import { Brain, PlayCircle } from 'lucide-react';
import { ScreenLayout } from '../../layouts/ScreenLayout';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { Icon } from '../../components/primitives/Icon';
import { StatCard } from '../../components/patterns/StatCard';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { practicePlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

const statusTone = { available: 'primary', completed: 'primary', locked: 'neutral' } as const;
const statusLabel = { available: 'Available', completed: 'Completed', locked: 'Locked' } as const;

export function Practice() {
  return (
    <ScreenLayout title="Practice" description={data.header.subheading}>
      <GlassPanel elevated className="relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-3">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={Brain} aria-label="Practice" size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-seg-text-primary">{data.header.heading}</h2>
              <p className="text-sm text-seg-text-secondary">{data.header.subheading}</p>
            </div>
          </div>
          <Badge tone="primary">Personalized for {data.currentRoleContext}</Badge>
        </div>
      </GlassPanel>

      <StatCard label="Available modules" value={`${data.overview.availableModules}`} iconLabel="Available modules" tone="primary" />
      <StatCard label="Sessions completed" value={`${data.overview.sessionsCompleted}`} iconLabel="Sessions completed" tone="primary" />
      <StatCard label="Average progress" value={`${data.overview.averageProgress}%`} iconLabel="Average progress" tone="primary" />

      <GlassPanel elevated className="col-span-1 flex flex-col items-center gap-3 py-10 text-center sm:col-span-2 lg:col-span-3">
        <Icon icon={PlayCircle} aria-label="No active session" size="lg" />
        <p className="text-sm font-medium text-seg-text-primary">No active training session</p>
        <p className="text-sm text-seg-text-secondary">Session behavior is not yet implemented.</p>
        <Button variant="outline" disabled>Start Session</Button>
      </GlassPanel>

      <GlassPanel className="col-span-1 flex flex-col gap-3 sm:col-span-2 lg:col-span-3">
        <h2 className="text-sm font-semibold text-seg-text-primary">Quick Access</h2>
        <div className="flex flex-wrap gap-2">
          {data.quickCategories.map((c) => <Button key={c} variant="outline" size="sm" disabled>{c}</Button>)}
        </div>
      </GlassPanel>

      <div className="col-span-1 grid grid-cols-1 gap-4 sm:col-span-2 lg:col-span-3 lg:grid-cols-2">
        {data.modules.map((m) => (
          <GlassPanel key={m.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-seg-text-primary">{m.title}</h3>
                <p className="text-xs text-seg-text-secondary">{m.description}</p>
              </div>
              <Badge tone="neutral">{m.difficulty}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <Badge tone={statusTone[m.status]}>{statusLabel[m.status]}</Badge>
              <Button variant="outline" size="sm" disabled={m.status !== 'available'}>
                {m.status === 'completed' ? 'Review' : 'Start'}
              </Button>
            </div>
          </GlassPanel>
        ))}
      </div>
    </ScreenLayout>
  );
}
