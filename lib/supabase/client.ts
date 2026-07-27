import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client for the SEG application.
 *
 * Scaffolding checkpoint: typed initialization only. This module deliberately
 * contains no queries, no auth flows, and no database operations - those belong
 * in the feature modules that consume the client.
 *
 * A lazy memoized factory is used instead of a module-level client so that
 * importing this file never throws at module-evaluation time. `next build`
 * evaluates imported modules without the Supabase environment variables
 * present, so eager initialization would fail the build.
 *
 * When generated Supabase types are introduced, add the generic in one place:
 * `createClient<Database>(...)` and widen the return type to
 * `SupabaseClient<Database>`.
 */

let browserClient: SupabaseClient | null = null;

function readPublicEnv(): { url: string; anonKey: string } {
  // Referenced as static literals so Next.js can inline these into the client bundle.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL (see .env.example)',
    );
  }

  if (!anonKey) {
    throw new Error(
      'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example)',
    );
  }

  return { url, anonKey };
}

/**
 * Returns the shared browser Supabase client, creating it on first call and
 * reusing it afterwards.
 *
 * Safe to call from client components. Uses only the anon key, which is public
 * by design and must be constrained by row level security in Supabase.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = readPublicEnv();
  browserClient = createClient(url, anonKey);

  return browserClient;
}
