import { PrismaClient } from '@prisma/client';

// Seed script for MVP reference/lookup data only, per SEG Backend Blueprint
// v1.1. This file is committed as part of the backend foundation and is NOT
// executed as part of this task. Run manually via `npm run db:seed` only
// after real Supabase credentials exist and migrations have been applied.

const prisma = new PrismaClient();

async function main() {
  const domain = await prisma.domain.upsert({
    where: { slug: 'emergency-medicine' },
    update: {},
    create: { name: 'Emergency Medicine', slug: 'emergency-medicine' },
  });

  const tracks = [
    { fullLabel: 'Intern Doctors / JMC', shortLabel: 'Intern / JMC', slug: 'intern_jmc', sortOrder: 1 },
    { fullLabel: 'Emergency Medicine Residents', shortLabel: 'EM Resident', slug: 'em_resident', sortOrder: 2 },
    { fullLabel: 'Medical Students', shortLabel: 'Med Student', slug: 'med_student', sortOrder: 3 },
    { fullLabel: 'General Practitioners', shortLabel: 'GP', slug: 'gp', sortOrder: 4 },
    { fullLabel: 'EMS / Paramedics', shortLabel: 'EMS/Paramedic', slug: 'ems_paramedic', sortOrder: 5 },
    { fullLabel: 'Emergency Nursing', shortLabel: 'ER Nursing', slug: 'er_nursing', sortOrder: 6 },
  ];

  for (const track of tracks) {
    await prisma.track.upsert({
      where: { slug: track.slug },
      update: {},
      create: { ...track, domainId: domain.id },
    });
  }

  const roles = ['learner', 'instructor', 'content_reviewer', 'admin'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const permissions = [
    { key: 'content.read', description: 'View content' },
    { key: 'content.write', description: 'Create or edit content' },
    { key: 'content.publish', description: 'Publish or unpublish content' },
    { key: 'user.manage', description: 'Manage user accounts' },
    { key: 'role.manage', description: 'Assign or revoke roles' },
    { key: 'audit.read', description: 'View audit logs' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {},
      create: permission,
    });
  }

  const rolePermissionMap: Record<string, string[]> = {
    learner: ['content.read'],
    instructor: ['content.read', 'content.write'],
    content_reviewer: ['content.read', 'content.write', 'content.publish'],
    admin: [
      'content.read',
      'content.write',
      'content.publish',
      'user.manage',
      'role.manage',
      'audit.read',
    ],
  };

  for (const [roleName, permissionKeys] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
    for (const permissionKey of permissionKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const contentTypes = ['module', 'lesson', 'protocol', 'drug', 'clinical_case', 'quiz', 'video'];
  for (const key of contentTypes) {
    await prisma.contentType.upsert({ where: { key }, update: {}, create: { key, label: key } });
  }

  const progressStatuses = ['not_started', 'in_progress', 'completed', 'locked'];
  for (const key of progressStatuses) {
    await prisma.progressStatus.upsert({ where: { key }, update: {}, create: { key, label: key } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
