import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase browser client — use in Client Components only.
 *
 * Reads cookies from the browser (document.cookie) so the user's
 * session is automatically attached to every Supabase request.
 * Safe to bundle — only uses NEXT_PUBLIC_* env vars.
 *
 * Usage:
 * ```ts
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 * const supabase = createClient();
 * ```
 */

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
