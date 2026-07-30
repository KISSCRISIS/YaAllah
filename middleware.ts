import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Root SEG middleware — session refresh + route protection.
 *
 * Every matched request refreshes the Supabase session so the auth
 * cookie never expires during active use.  Protected app routes are
 * gated behind a secure call to getUser() (server-side verification),
 * not a simple getSession() (client-readable JWT decode).
 */

/** Exact-prefix match — covers the route and all sub-paths. */
const PROTECTED = [
  '/dashboard',
  '/pathway',
  '/learn',
  '/practice',
  '/drug-reference',
  '/journal',
] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );
}

export async function middleware(request: NextRequest) {
  // Clone the response so cookie mutations survive redirects.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ---------------------------------------------------------------
  // 1. Refresh session (keep cookie alive on every matched request)
  // ---------------------------------------------------------------
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------------
  // 2. Authenticated user on /login  →  dashboard
  // ---------------------------------------------------------------
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // ---------------------------------------------------------------
  // 3. Unauthenticated user on protected route  →  /login
  // ---------------------------------------------------------------
  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ---------------------------------------------------------------
  // 4. Allowed — return the response with refreshed cookies
  // ---------------------------------------------------------------
  return response;
}

export const config = {
  matcher: [
    /*
     * Match every request except:
     * - _next/static   (static chunks)
     * - _next/image    (image optimisation)
     * - favicon.ico    (favicon)
     * - static assets  (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
