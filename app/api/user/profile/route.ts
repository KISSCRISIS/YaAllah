// ---------------------------------------------------------------------------
// GET /api/user/profile
// ---------------------------------------------------------------------------
// Phase 0.5 — First SEG API Route.  Establishes the pattern that every
// future route handler (Drug Reference, Journal, Practice, Pathway, etc.)
// must follow:
//
//   1. Server-side identity verification  (supabase.auth.getUser)
//   2. Query-level ownership scoping       (where: { id: user.id })
//   3. Explicit field selection           (no SELECT *)
//   4. Sanitized error responses          (never expose internals)
//   5. Single-responsibility handler       (one HTTP method per export)
//
// ---------------------------------------------------------------------------
// Phase 0.5 Temporary Decision:
//   Prisma query-level ownership is used temporarily until Supabase RLS
//   policies are deployed.  When RLS is activated, review API data-access
//   strategy and migrate to Supabase client for user-facing queries.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

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
    // 2. QUERY — scoped to the authenticated user
    // ---------------------------------------------------------------
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      );
    }

    // ---------------------------------------------------------------
    // 3. RESPOND
    // ---------------------------------------------------------------
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    // Log internally only — never expose Prisma / Supabase internals.
    console.error('GET /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
