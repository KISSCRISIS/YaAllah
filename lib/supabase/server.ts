import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase server client — use in:
 * - Server Components (data fetching)
 * - Route Handlers (app/api/...)
 * - Server Actions
 *
 * Reads cookies via next/headers so the session is scoped to the
 * incoming request.  Does NOT include the service_role key by
 * default — user-facing queries go through RLS and must carry the
 * authenticated user's JWT.
 */

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // sessions.
          }
        },
      },
    },
  );
}
