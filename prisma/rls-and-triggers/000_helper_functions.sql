-- Helper functions used by RLS policies in 002_rls_policies.sql.
-- DRAFT: not yet executed against any database, not CLI-validated.
-- Must be applied BEFORE 002_rls_policies.sql in the final migration.

-- SECURITY DEFINER is required so this function can read `user_roles`/
-- `roles` regardless of the calling user's own RLS restrictions on those
-- tables (otherwise policies referencing this function would recurse into
-- RLS-restricted reads and always evaluate false for non-admins).
--
-- search_path is pinned to '' (empty), not 'public', because the function
-- body already fully-qualifies every reference (public.user_roles,
-- public.roles, auth.uid()) — an empty search_path removes any reliance
-- on schema resolution order and closes the search_path-hijack surface
-- entirely, per current Postgres/Supabase SECURITY DEFINER guidance.
--
-- This function is read-only, scoped to auth.uid() (the caller's own
-- session), and takes no parameter that could be used to query another
-- user's roles — it does not itself grant or escalate any privilege, it
-- only answers "does the current session's user have this role".
CREATE OR REPLACE FUNCTION public.has_role(role_key text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = role_key
  );
$$;

-- Restrict who can call this SECURITY DEFINER function. Postgres grants
-- EXECUTE to PUBLIC by default on function creation; explicitly revoke
-- that and grant only to the `authenticated` role (Supabase's default
-- role for logged-in users). `anon` callers will simply always get
-- `false` since auth.uid() is null for them, but restricting the grant
-- reduces the callable surface as defense in depth.
REVOKE EXECUTE ON FUNCTION public.has_role(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(text) TO authenticated;
