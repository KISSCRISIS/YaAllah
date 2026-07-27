-- Helper functions used by RLS policies in 002_rls_policies.sql.
-- DRAFT: not yet executed against any database, not CLI-validated.
-- Must be applied BEFORE 002_rls_policies.sql in the final migration.

-- SECURITY DEFINER is required so this function can read `user_roles`/
-- `roles` regardless of the calling user's own RLS restrictions on those
-- tables (otherwise policies referencing this function would recurse into
-- RLS-restricted reads and always evaluate false for non-admins).
-- search_path is pinned to prevent search_path hijacking on a SECURITY
-- DEFINER function.
CREATE OR REPLACE FUNCTION public.has_role(role_key text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = role_key
  );
$$;
