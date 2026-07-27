# Migration Readiness Checklist

This checklist must be completed, in order, by someone with real Supabase
project credentials and local/CI shell access. **No command below has been
executed as part of any MR in this repository.** Nothing here has been run
against a live database or validated by the Prisma CLI.

## Prerequisites
- [ ] Real Supabase project created (or confirmed) for the target environment
- [ ] `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) populated in a local
      `.env` (never committed) per `.env.example`
- [ ] Dependencies installed (`npm install`)

## Commands (run in this exact order)

1. `npx prisma validate`
   - Confirms `prisma/schema.prisma` is syntactically valid.
   - Requires local execution; does not require a live DB connection.

2. `npx prisma migrate dev --create-only`
   - Generates the initial migration SQL from `prisma/schema.prisma`
     without applying it.
   - Requires `DIRECT_URL` to be reachable.
   - After this runs, manually append the SQL from
     `prisma/rls-and-triggers/` into the generated `migration.sql`, in
     this exact order:
     1. `000_helper_functions.sql`
     2. `001_auth_fk_and_triggers.sql`
     3. `002_rls_policies.sql`

3. `npx prisma migrate deploy`
   - Applies the combined migration (Prisma-generated DDL + hand-written
     SQL) to the database.
   - Run against a staging/disposable Supabase project first. Do not run
     directly against production.

## Post-migration validation (manual, not yet automated)
- [ ] Confirm Row Level Security is enabled on all 16 MVP tables
- [ ] Test each RLS policy with a real authenticated session (not just the
      service-role connection)
- [ ] Confirm the `handle_new_user` trigger creates a `profiles` row on
      signup
- [ ] Confirm the `on_content_updated` trigger inserts a `content_versions`
      row when `content.body` changes
- [ ] Run `npm run db:seed` only after the checks above pass

## Status
No command in this checklist has been executed. This file exists solely to
make the exact next steps unambiguous for whoever has real Supabase
credentials and can run them.
