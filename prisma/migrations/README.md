# Prisma Migrations — Process Notes

This project uses a hybrid migration process:

1. `prisma/schema.prisma` is the single source of truth for table structure
   (columns, types, relations, indexes). Supabase Studio's schema editor must
   never be used to hand-edit schema — doing so causes drift between
   Prisma's migration history and the live database.
2. Migrations are generated using `npx prisma migrate diff --from-empty`
   to produce a clean, baseline migration matching the current schema.
3. Before that generated migration is applied, hand-authored SQL from
   `prisma/rls-and-triggers/` must be appended to the generated
   `migration.sql` file: the `auth.users` foreign key + triggers
   (`001_auth_fk_and_triggers.sql`) and the Row Level Security policies
   (`002_rls_policies.sql`). The `has_role()` helper function
   (`000_helper_functions.sql`) must also be appended, before RLS policies.
4. Only after both the Prisma-generated DDL and the hand-authored RLS/trigger
   SQL are combined in one migration file should it be applied via
   `npx prisma migrate deploy`.
5. Reference/lookup data (domains, tracks, roles, content_types,
   progress_status) is seeded via `npm run db:seed` (see `prisma/seed.ts`),
   run after migrations are applied — not entered manually through Supabase
   Studio.

## Migration History

| Migration | Type | Status |
|---|---|---|
| `20260730_uuid_migration` | UUID baseline (all16 tables) | Generated — NOT YET DEPLOYED |
| `ARCHIVED_20260727201900_init_Int_SERIAL_replaced_by_UUID` | Legacy Int/SERIAL (obsolete) | Archived — replaced by UUID migration |

## Next Steps

1. Append RLS SQL files to `20260730_uuid_migration/migration.sql`
2. `npx prisma migrate deploy` against staging Supabase
3. `npm run db:seed`
4. Validate RLS policies with authenticated session
