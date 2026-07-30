import { PrismaClient } from '@prisma/client';

// Seed script for MVP reference/lookup data only, per SEG Backend Blueprint
// v1.2 — Updated for UUID schema (Phase 0.3A). Model names match
// snake_case introspected from PostgreSQL via multiSchema.

const prisma = new PrismaClient();

async function main() {
  const domain = await prisma.domains.upsert({
    where: { slug: 'emergency-medicine' },
    update: {},
    create: { name: 'Emergency Medicine', slug: 'emergency-medicine' },
  });

  const tracks = [
    { full_label: 'Intern Doctors / JMC', short_label: 'Intern / JMC', slug: 'intern_jmc', sort_order: 1 },
    { full_label: 'Emergency Medicine Residents', short_label: 'EM Resident', slug: 'em_resident', sort_order: 2 },
    { full_label: 'Medical Students', short_label: 'Med Student', slug: 'med_student', sort_order: 3 },
    { full_label: 'General Practitioners', short_label: 'GP', slug: 'gp', sort_order: 4 },
    { full_label: 'EMS / Paramedics', short_label: 'EMS/Paramedic', slug: 'ems_paramedic', sort_order: 5 },
    { full_label: 'Emergency Nursing', short_label: 'ER Nursing', slug: 'er_nursing', sort_order: 6 },
  ];

  for (const track of tracks) {
    await prisma.tracks.upsert({
      where: { slug: track.slug },
      update: {},
      create: { ...track, domain_id: domain.id },
    });
  }

  const roles = ['learner', 'instructor', 'content_reviewer', 'admin'];
  for (const name of roles) {
    await prisma.roles.upsert({ where: { name }, update: {}, create: { name } });
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
    await prisma.permissions.upsert({
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
    const role = await prisma.roles.findUniqueOrThrow({ where: { name: roleName } });
    for (const permissionKey of permissionKeys) {
      const permission = await prisma.permissions.findUniqueOrThrow({ where: { key: permissionKey } });
      await prisma.role_permissions.upsert({
        where: { role_id_permission_id: { role_id: role.id, permission_id: permission.id } },
        update: {},
        create: { role_id: role.id, permission_id: permission.id },
      });
    }
  }

  const contentTypes = ['module', 'lesson', 'protocol', 'drug', 'clinical_case', 'quiz', 'video'];
  for (const key of contentTypes) {
    await prisma.content_types.upsert({ where: { key }, update: {}, create: { key, label: key } });
  }

  const progressStatuses = ['not_started', 'in_progress', 'completed', 'locked'];
  for (const key of progressStatuses) {
    await prisma.progress_status.upsert({ where: { key }, update: {}, create: { key, label: key } });
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
