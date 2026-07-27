-- DRAFT: hand-written RLS policy SQL to be appended into the first real
-- Prisma-generated migration. NOT executed against any database. NOT
-- validated by the Prisma CLI or against a live Postgres instance.
-- Requires 000_helper_functions.sql (public.has_role) to be applied first.
-- Assumes Supabase's auth.uid()/auth.role() helpers (Supabase Postgres
-- only; will not work on a vanilla Postgres instance).

-- profiles: own row select/update; admin can select all
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT USING (id = auth.uid() OR public.has_role('admin'));
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- roles: admin-read only, no client writes
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY roles_select_admin_only ON public.roles
  FOR SELECT USING (public.has_role('admin'));

-- permissions: admin-read only, no client writes
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY permissions_select_admin_only ON public.permissions
  FOR SELECT USING (public.has_role('admin'));

-- role_permissions: admin-read only, no client writes
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY role_permissions_select_admin_only ON public.role_permissions
  FOR SELECT USING (public.has_role('admin'));

-- user_roles: admin-read only; assignment happens via Prisma admin
-- scripts using the service-role connection, which bypasses RLS by
-- design, so no client write policy is defined here.
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_roles_select_admin_only ON public.user_roles
  FOR SELECT USING (public.has_role('admin'));

-- audit_logs: no client select or write at all; system-written only
-- (via service-role backend jobs / Server Actions). No policies are
-- defined, so RLS denies all client access by default.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- domains: authenticated read; no client writes
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY domains_select_authenticated ON public.domains
  FOR SELECT USING (auth.role() = 'authenticated');

-- tracks: authenticated read; no client writes
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tracks_select_authenticated ON public.tracks
  FOR SELECT USING (auth.role() = 'authenticated');

-- user_tracks: own row select; self-insert once at registration;
-- update/delete admin-only (no client policy defined for those)
ALTER TABLE public.user_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_tracks_select_own ON public.user_tracks
  FOR SELECT USING (user_id = auth.uid() OR public.has_role('admin'));
CREATE POLICY user_tracks_insert_own ON public.user_tracks
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- content_types: authenticated read; no client writes
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_types_select_authenticated ON public.content_types
  FOR SELECT USING (auth.role() = 'authenticated');

-- categories: authenticated read; no client writes
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_select_authenticated ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- content: authenticated read of published rows only (reviewers/admins
-- can read drafts too); write restricted to content_reviewer/admin
-- NOTE (risk): the write policy uses FOR ALL, which includes DELETE.
-- Confirm this is intended before applying.
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_select_published ON public.content
  FOR SELECT USING (
    is_published = true
    OR public.has_role('content_reviewer')
    OR public.has_role('admin')
  );
CREATE POLICY content_write_reviewer_admin ON public.content
  FOR ALL USING (public.has_role('content_reviewer') OR public.has_role('admin'))
  WITH CHECK (public.has_role('content_reviewer') OR public.has_role('admin'));

-- content_versions: read restricted to content_reviewer/admin;
-- insert-only, created by the on_content_updated trigger (SECURITY
-- DEFINER) — no direct client insert policy is defined.
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_versions_select_reviewer_admin ON public.content_versions
  FOR SELECT USING (public.has_role('content_reviewer') OR public.has_role('admin'));

-- content_prerequisites: authenticated read (needed client-side to
-- compute locked/available states); write admin-only
ALTER TABLE public.content_prerequisites ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_prerequisites_select_authenticated ON public.content_prerequisites
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY content_prerequisites_write_admin ON public.content_prerequisites
  FOR ALL USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

-- progress_status: authenticated read-only reference table
ALTER TABLE public.progress_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY progress_status_select_authenticated ON public.progress_status
  FOR SELECT USING (auth.role() = 'authenticated');

-- user_content_progress: own row select/insert/update only
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_content_progress_select_own ON public.user_content_progress
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY user_content_progress_insert_own ON public.user_content_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY user_content_progress_update_own ON public.user_content_progress
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
