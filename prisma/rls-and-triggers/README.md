# RLS Policies & Triggers — Placeholders

This folder holds hand-authored raw SQL that Prisma cannot express
declaratively (Row Level Security policies and Postgres triggers/functions).
None of this SQL is a standalone migration and none of it has been applied
anywhere.

Process: once `npx prisma migrate dev --name init` generates the first real
migration from `prisma/schema.prisma`, the SQL in this folder must be
appended to that generated `migration.sql` file before it is applied, per
`prisma/migrations/README.md`.

Files:
- `001_auth_fk_and_triggers.sql` — foreign key from `profiles.id` to
  Supabase's `auth.users.id`, plus trigger placeholders (auto-create profile
  on signup, auto-version content on update).
- `002_rls_policies.sql` — table-by-table RLS policy plan for every MVP
  table.
