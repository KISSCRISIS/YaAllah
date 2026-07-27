'use client';
import dynamic from 'next/dynamic';
import { ScreenLayout } from '../../layouts/ScreenLayout';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { ProgressBar } from '../../components/primitives/ProgressBar';
import { Badge } from '../../components/primitives/Badge';
import { IconPlaceholder } from '../../components/primitives/IconPlaceholder';
import { StatCard } from '../../components/patterns/StatCard';
import { ListItem } from '../../components/patterns/ListItem';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { learnPlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

const statusTone = { completed: 'primary', 'in-progress': 'warning', 'not-started': 'neutral' } as const;
const statusLabel = { completed: 'Completed', 'in-progress': 'In progress', 'not-started': 'Not started' } as const;

export function Learn() {
  const categories = Array.from(new Set(data.modules.map((m) => m.category)));

  return (
    <ScreenLayout title="Learn" description={data.header.subheading}>
      <GlassPanel elevated className="relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-3">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconPlaceholder label="Learn" size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-seg-text-primary">{data.header.heading}</h2>
              <p className="text-sm text-seg-text-secondary">{data.header.subheading}</p>
            </div>
          </div>
          <Badge tone="primary">Personalized for {data.currentRoleContext}</Badge>
        </div>
      </GlassPanel>

      <StatCard label="Modules completed" value={`${data.overview.modulesCompleted}/${data.overview.totalModules}`} iconLabel="Modules completed" tone="primary" />
      <StatCard label="Overall progress" value={`${data.overview.overallProgress}%`} iconLabel="Overall progress" tone="primary" />

      <GlassPanel className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-seg-text-primary">Recommended</h2>
        {data.recommended.map((r) => <ListItem key={r.id} title={r.title} meta={r.meta} />)}
      </GlassPanel>

      {categories.map((category) => (
        <div key={category} className="col-span-1 flex flex-col gap-4 sm:col-span-2 lg:col-span-3">
          <h2 className="text-sm font-semibold text-seg-text-primary">{category}</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.modules.filter((m) => m.category === category).map((m) => (
              <GlassPanel key={m.id} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-seg-text-primary">{m.title}</h3>
                    <p className="text-xs text-seg-text-secondary">{m.description}</p>
                  </div>
                  <Badge tone={statusTone[m.status]}>{statusLabel[m.status]}</Badge>
                </div>
                <ProgressBar value={m.progress} />
              </GlassPanel>
            ))}
          </div>
        </div>
      ))}
    </ScreenLayout>
  );
}
