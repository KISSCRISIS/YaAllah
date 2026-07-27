-- Placeholder for hand-authored SQL to be appended into the first real
-- Prisma-generated migration (see prisma/migrations/README.md).
-- Do NOT apply this file directly. Do NOT run this against any database yet.

-- TODO 1: Add foreign key from public.profiles.id to auth.users.id.
--   auth.users is managed by Supabase Auth and is intentionally not a
--   Prisma model (see the comment above the Profile model in
--   prisma/schema.prisma). Fill in after `prisma migrate dev` generates the
--   profiles table, e.g.:
--     ALTER TABLE "profiles"
--       ADD CONSTRAINT "profiles_id_fkey"
--       FOREIGN KEY ("id") REFERENCES auth.users(id) ON DELETE CASCADE;

-- TODO 2: Add a trigger function that auto-creates a `profiles` row whenever
--   a new row is inserted into auth.users, so every authenticated user
--   always has a corresponding profile row. Function + trigger to be
--   authored once real table/column names are finalized by the first
--   migration.

-- TODO 3: Add a trigger on `content` updates that inserts a row into
--   `content_versions` capturing the previous `body` before the update is
--   applied, so no content change ships without a version record.
