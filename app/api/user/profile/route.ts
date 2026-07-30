// ---------------------------------------------------------------------------
// GET /api/user/profile
// ---------------------------------------------------------------------------
// SEG API Route — user-facing data access pattern.
// Every future route handler (Drug Reference, Journal, Practice, Pathway,
// Learn, etc.) must follow this pattern:
//
//   1. Server-side identity verification  (supabase.auth.getUser)
//   2. Supabase client query with RLS      (supabase.from().select())
//   3. Explicit field selection           (no SELECT *)
//   4. Sanitized error responses          (never expose internals)
//   5. Single-responsibility handler       (one HTTP method per export)
//
// Data access governance: all user-facing queries go through the Supabase
// client so Postgres Row Level Security is enforced per request via the
// user's JWT / auth.uid().  Prisma is restricted to schema / migrations /
// seed / admin scripts only.  See prisma/README.md.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // ---------------------------------------------------------------
    // 1. VERIFY IDENTITY — server-side call to Supabase Auth
    // ---------------------------------------------------------------
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ---------------------------------------------------------------
    // 2. QUERY — Supabase client enforces RLS via the user's JWT.
    //    profiles_select_own_or_admin policy ensures each user can
    //    only read their own row (admin can read all).
    // ---------------------------------------------------------------
    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (queryError) {
      // .single() returns error code PGRST116 when 0 rows match.
      if (queryError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 },
        );
      }
      console.error('GET /api/user/profile — query error:', queryError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    // ---------------------------------------------------------------
    // 3. MAP — convert Supabase snake_case to API camelCase contract.
    //    Preserves the existing response shape for API consumers.
    // ---------------------------------------------------------------
    const profile = {
      id: data.id,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // ---------------------------------------------------------------
    // 4. RESPOND
    // ---------------------------------------------------------------
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('GET /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
