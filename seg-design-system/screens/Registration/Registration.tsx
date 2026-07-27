'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { IconPlaceholder } from '../../components/primitives/IconPlaceholder';
import { cn } from '../../components/utils/cn';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { registrationPlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

export function Registration() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-seg-canvas text-seg-text-primary lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-e border-seg-border p-10 lg:flex lg:flex-col lg:justify-between">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex items-center gap-2">
          <IconPlaceholder label="SEG logo" size="lg" />
          <div>
            <p className="text-sm font-semibold leading-none text-seg-text-primary">{data.brand.name}</p>
            <p className="text-xs text-seg-text-secondary">{data.brand.tagline}</p>
          </div>
        </div>
        <div className="relative max-w-sm">
          <h2 className="text-2xl font-semibold text-seg-text-primary">{data.intro.heading}</h2>
          <p className="mt-2 text-sm text-seg-text-secondary">{data.intro.subheading}</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <GlassPanel elevated padding="lg" className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <IconPlaceholder label="SEG logo" />
            <p className="text-sm font-semibold text-seg-text-primary">{data.brand.name}</p>
          </div>
          <h1 className="mb-6 text-xl font-semibold text-seg-text-primary">Create your account</h1>

          <div className="flex flex-col gap-4">
            <Input label="Full name" placeholder="Jordan Rivera" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />

            <div>
              <p className="mb-1.5 text-sm font-medium text-seg-text-primary">Role</p>
              <div className="flex flex-wrap gap-2">
                {data.roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={selectedRole === r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={cn(
                      'rounded-seg-full px-3 py-1 text-xs font-medium transition-colors duration-seg-fast ease-seg-standard',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary',
                      selectedRole === r.id
                        ? 'bg-seg-primary/20 text-seg-primary'
                        : 'bg-seg-text-secondary/10 text-seg-text-secondary hover:bg-seg-surface'
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-seg-text-secondary">
                Role assignment behavior is not yet implemented.
              </p>
            </div>

            <Button variant="primary" size="lg" disabled>Create Account</Button>
            <p className="text-xs text-seg-text-secondary">
              Account creation is not yet implemented.
            </p>

            <Button variant="ghost" size="sm">Already have an account? Sign in</Button>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
