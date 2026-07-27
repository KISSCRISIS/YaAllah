# RLS Policies & Triggers — Placeholders

This folder holds hand-authored raw SQL that Prisma cannot express
declaratively (Row Level Security policies and Postgres triggers/functions).
None of this SQL is a standalone migration and none of it has been applied
anywhere.

Process: once `npx prisma migrate dev --name init` generates the first real
migration from `prisma/schema.prisma`, the SQL in this folder must be
appended to that generated `migration.sql` file before it is applied, per
`prisma/migrations/README.md`.

Files (applied in this order when appended to the real migration):
- `000_helper_functions.sql` — `public.has_role()` SECURITY DEFINER helper
  used by the RLS policies below.
- `001_auth_fk_and_triggers.sql` — foreign key from `profiles.id` to
  Supabase's `auth.users.id`, the `handle_new_user` trigger (auto-create
  profile on signup), and the `content_versions` auto-snapshot trigger.
- `002_rls_policies.sql` — `ENABLE ROW LEVEL SECURITY` and initial policies
  for every MVP table.

Status: all three files now contain real, reviewed SQL (no more TODOs).
None of it has been executed against any database or validated by the
Prisma CLI — treat it as a draft until run through
`npx prisma migrate dev --create-only` (or applied to a disposable/staging
Supabase project) and manually tested.
