'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GlassPanel } from '@/seg-design-system/components/primitives/GlassPanel';
import { Button } from '@/seg-design-system/components/primitives/Button';
import { Input } from '@/seg-design-system/components/primitives/Input';
import { Icon } from '@/seg-design-system/components/primitives/Icon';
import { HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-seg-canvas p-4">
      <GlassPanel elevated className="w-full max-w-sm">
        {/* Brand header */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <Icon icon={HeartPulse} size="lg" aria-label="SEG" className="text-seg-primary" />
          <h1 className="text-xl font-semibold text-seg-text-primary">Smart Emergency Guide</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          {error && (
            <p role="alert" className="text-xs text-seg-emergency">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="mt-2 w-full">
            Sign In
          </Button>
        </form>
      </GlassPanel>
    </div>
  );
}
