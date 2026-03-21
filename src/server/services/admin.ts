import { prisma } from '@/server/db/prisma';

export async function getAdminDashboardData() {
  const [users, materials, performers] = await Promise.all([
    prisma.user.findMany({ include: { performerProfile: true }, orderBy: { createdAt: 'desc' } }),
    prisma.studyMaterial.findMany({ include: { author: true }, orderBy: [{ status: 'asc' }, { createdAt: 'desc' }] }),
    prisma.performerProfile.findMany({ include: { user: true }, orderBy: [{ isVerified: 'asc' }, { ratingAverage: 'desc' }] })
  ]);

  return {
    users: users.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      university: item.university,
      course: item.course,
      isPerformer: Boolean(item.performerProfile)
    })),
    materials: materials.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      type: item.type,
      subject: item.subject,
      university: item.university,
      author: item.author.name,
      aiModeration: item.aiModeration,
      createdAt: item.createdAt.toISOString()
    })),
    performers: performers.map((item) => ({
      id: item.id,
      name: item.user.name,
      university: item.user.university,
      isVerified: item.isVerified,
      ratingAverage: item.ratingAverage,
      ratingCount: item.ratingCount
    }))
  };
}
