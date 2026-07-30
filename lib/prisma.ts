// ---------------------------------------------------------------------------
// Prisma Client — Next.js Singleton (development hot-reload safe)
// ---------------------------------------------------------------------------
// Prisma in this project is restricted to schema / migrations / seed /
// admin scripts only. All user-facing reads/writes go through the Supabase
// client so Postgres Row Level Security is enforced per request.
//
// See: prisma/README.md
// ---------------------------------------------------------------------------

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
