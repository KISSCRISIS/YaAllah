import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client for the SEG application.
 *
 * Scaffolding checkpoint: typed initialization only. This module deliberately
 * contains no queries, no auth flows, and no database operations - those belong
 * in the server modules that consume the client.
 *
 * This client uses the service role key, which bypasses row level security. It
 * must never reach the client bundle, so the factory refuses to run in a
 * browser environment and the key is read from a non-`NEXT_PUBLIC_` variable.
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

let serverClient: SupabaseClient | null = null;

function readServerEnv(): { url: string; serviceRoleKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL (see .env.example)',
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing environment variable: SUPABASE_SERVICE_ROLE_KEY (see .env.example)',
    );
  }

  return { url, serviceRoleKey };
}

/**
 * Returns the shared server Supabase client, creating it on first call and
 * reusing it afterwards.
 *
 * Server-only. Throws if called in a browser environment, since the service
 * role key bypasses row level security and must never be exposed to clients.
 *
 * Session persistence and token auto-refresh are disabled because there is no
 * browser storage to persist into and the service role key does not expire the
 * way a user session does.
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error(
      'getSupabaseServerClient() must not be called in the browser: it uses the Supabase service role key.',
    );
  }

  if (serverClient) {
    return serverClient;
  }

  const { url, serviceRoleKey } = readServerEnv();

  serverClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}
