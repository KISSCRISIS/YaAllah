CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "org_id" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "domain_id" UUID NOT NULL,
    "full_label" TEXT NOT NULL,
    "short_label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tracks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "track_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "user_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "domain_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_type_id" UUID NOT NULL,
    "category_id" UUID,
    "domain_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body" JSONB,
    "media_path" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "body_snapshot" JSONB NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_prerequisites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_id" UUID NOT NULL,
    "prerequisite_content_id" UUID NOT NULL,

    CONSTRAINT "content_prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_status" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "progress_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_content_progress" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "status_id" UUID NOT NULL,
    "progress_percent" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "last_interacted_at" TIMESTAMP(3),

    CONSTRAINT "user_content_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_org_id_key" ON "user_roles"("user_id", "role_id", "org_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "domains_slug_key" ON "domains"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_slug_key" ON "tracks"("slug");

-- CreateIndex
CREATE INDEX "tracks_domain_id_idx" ON "tracks"("domain_id");

-- CreateIndex
CREATE INDEX "user_tracks_user_id_idx" ON "user_tracks"("user_id");

-- CreateIndex
CREATE INDEX "user_tracks_track_id_idx" ON "user_tracks"("track_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_types_key_key" ON "content_types"("key");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_domain_id_idx" ON "categories"("domain_id");

-- CreateIndex
CREATE INDEX "content_content_type_id_idx" ON "content"("content_type_id");

-- CreateIndex
CREATE INDEX "content_category_id_idx" ON "content"("category_id");

-- CreateIndex
CREATE INDEX "content_domain_id_idx" ON "content"("domain_id");

-- CreateIndex
CREATE INDEX "content_versions_content_id_idx" ON "content_versions"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_content_id_version_number_key" ON "content_versions"("content_id", "version_number");

-- CreateIndex
CREATE INDEX "content_prerequisites_prerequisite_content_id_idx" ON "content_prerequisites"("prerequisite_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_prerequisites_content_id_prerequisite_content_id_key" ON "content_prerequisites"("content_id", "prerequisite_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "progress_status_key_key" ON "progress_status"("key");

-- CreateIndex
CREATE INDEX "user_content_progress_user_id_idx" ON "user_content_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_content_progress_user_id_content_id_key" ON "user_content_progress"("user_id", "content_id");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tracks" ADD CONSTRAINT "user_tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tracks" ADD CONSTRAINT "user_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_prerequisites" ADD CONSTRAINT "content_prerequisites_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_prerequisites" ADD CONSTRAINT "content_prerequisites_prerequisite_content_id_fkey" FOREIGN KEY ("prerequisite_content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_content_progress" ADD CONSTRAINT "user_content_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_content_progress" ADD CONSTRAINT "user_content_progress_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_content_progress" ADD CONSTRAINT "user_content_progress_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "progress_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ============================================================================
-- SEG Phase 0.3A-8 Appended Block: RLS, Triggers, Auth FK, Helper Functions
-- Source: prisma/rls-and-triggers/
-- Append order: 000 → 001 → 002 (per README and Phase 0.3A-7 review)
-- ============================================================================


-- ============================================================================
-- BLOCK 1/3: prisma/rls-and-triggers/000_helper_functions.sql
-- Helper functions used by RLS policies in BLOCK 3/3.
-- Must be applied BEFORE 002_rls_policies.sql in the final migration.
-- ============================================================================

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


-- ============================================================================
-- BLOCK 2/3: prisma/rls-and-triggers/001_auth_fk_and_triggers.sql
-- Cross-schema FK (profiles → auth.users), auto-create-profile trigger,
-- and content-version auto-snapshot trigger.
-- ============================================================================

-- 1. Foreign key from public.profiles.id to Supabase's auth.users.id.
--    auth.users is managed by Supabase Auth and is intentionally not a
--    Prisma model (see the comment above the Profile model in
--    prisma/schema.prisma).
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Auto-create a profiles row whenever a new row is inserted into
--    auth.users, so every authenticated user always has a profile.
-- search_path pinned to '' (empty): the function body already
-- fully-qualifies every reference (public.profiles), so an empty
-- search_path removes any reliance on schema resolution order.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Auto-snapshot the previous body of a `content` row into
--    `content_versions` whenever `body` changes on update, so no
--    content change ships without a version record.
--    NOTE (risk): this attributes the snapshot's `created_by` to
--    content.created_by (the original author field), not a distinct
--    "last editor". The schema has no updated_by column; adding one is
--    a future schema change, out of scope here.
-- search_path pinned to '' (empty): the function body already
-- fully-qualifies every reference (public.content_versions), so an
-- empty search_path removes any reliance on schema resolution order.
CREATE OR REPLACE FUNCTION public.handle_content_version_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  next_version_number integer;
BEGIN
  IF (OLD.body IS DISTINCT FROM NEW.body) THEN
    SELECT COALESCE(MAX(version_number), 0) + 1
      INTO next_version_number
      FROM public.content_versions
      WHERE content_id = OLD.id;

    INSERT INTO public.content_versions (content_id, version_number, body_snapshot, created_by)
    VALUES (OLD.id, next_version_number, OLD.body, NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_content_updated ON public.content;
CREATE TRIGGER on_content_updated
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.handle_content_version_snapshot();

-- NOTE: audit_logs is intentionally NOT trigger-based. Per the approved
-- design, audit_logs rows are written by backend jobs / Server Actions
-- using the service-role connection, not by a database trigger. No
-- trigger is defined here for audit_logs.


-- ============================================================================
-- BLOCK 3/3: prisma/rls-and-triggers/002_rls_policies.sql
-- Row Level Security: enable RLS on all 16 tables and create 23 policies.
-- Requires BLOCK 1/3 (public.has_role) to be applied first.
-- ============================================================================

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
-- can read drafts too); INSERT/UPDATE restricted to content_reviewer/
-- admin. No DELETE policy is defined, so DELETE is denied by default
-- for every client role (RLS deny-all). If an explicit admin-only
-- delete capability is required later, add a dedicated DELETE policy
-- at that time — not added now, per review decision.
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_select_published ON public.content
  FOR SELECT USING (
    is_published = true
    OR public.has_role('content_reviewer')
    OR public.has_role('admin')
  );
CREATE POLICY content_insert_reviewer_admin ON public.content
  FOR INSERT WITH CHECK (public.has_role('content_reviewer') OR public.has_role('admin'));
CREATE POLICY content_update_reviewer_admin ON public.content
  FOR UPDATE USING (public.has_role('content_reviewer') OR public.has_role('admin'))
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
