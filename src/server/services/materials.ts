import { prisma } from '@/server/db/prisma';

export async function getApprovedMaterials() {
  const materials = await prisma.studyMaterial.findMany({
    where: { status: 'APPROVED' },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return materials.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    subject: item.subject,
    university: item.university,
    type: item.type,
    status: item.status,
    downloadUrl: item.downloadUrl,
    createdAt: item.createdAt.toISOString(),
    author: item.author.name
  }));
}
