-- DRAFT: hand-written SQL to be appended into the first real
-- Prisma-generated migration (see prisma/migrations/README.md).
-- NOT executed against any database. NOT validated by the Prisma CLI.
-- Column/table names below are cross-checked by hand against the @map/
-- @@map values in prisma/schema.prisma as merged in MR !1.

-- 1. Foreign key from public.profiles.id to Supabase's auth.users.id.
--    auth.users is managed by Supabase Auth and is intentionally not a
--    Prisma model (see the comment above the Profile model in
--    prisma/schema.prisma).
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Auto-create a profiles row whenever a new row is inserted into
--    auth.users, so every authenticated user always has a profile.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
CREATE OR REPLACE FUNCTION public.handle_content_version_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
