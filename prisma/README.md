# Prisma — Scope & Responsibilities

Prisma in this project is restricted to:
- Schema definition (`prisma/schema.prisma`)
- Migrations (`prisma/migrations/`, combined with hand-authored SQL in
  `prisma/rls-and-triggers/`)
- Seeding reference/lookup data (`prisma/seed.ts`)
- Future admin scripts and backend jobs (not yet implemented)

Prisma is NOT used for user-facing data access. All user-facing reads/writes
go through the Supabase client (`supabase-js`) so that Postgres Row Level
Security (RLS) is enforced per request via the user's JWT / `auth.uid()`
context. Prisma connects with a privileged connection string that would
otherwise bypass RLS if used for user-facing queries — this separation is a
hard architectural rule established in SEG Backend Blueprint v1.1, not a
style preference.

Supabase Auth's `auth.users` table is intentionally not modeled in
`prisma/schema.prisma`. See the comment above the `Profile` model in that
file.

No authentication, Server Actions, or UI wiring has been added as part of
this foundation setup.
