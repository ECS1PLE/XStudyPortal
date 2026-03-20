import { prisma } from '@/server/db/prisma';

export async function refreshPerformerRating(performerId: string) {
  const aggregation = await prisma.performerReview.aggregate({
    where: { performerId },
    _avg: { rating: true },
    _count: { _all: true }
  });

  const ratingAverage = Number((aggregation._avg.rating ?? 0).toFixed(1));
  const ratingCount = aggregation._count._all;

  return prisma.performerProfile.update({
    where: { id: performerId },
    data: {
      ratingAverage,
      ratingCount
    }
  });
}

export async function upsertPerformerReview(params: {
  performerId: string;
  authorId: string;
  rating: number;
  comment?: string;
}) {
  const performer = await prisma.performerProfile.findUnique({
    where: { id: params.performerId },
    include: { user: true }
  });

  if (!performer) {
    throw new Error('Исполнитель не найден.');
  }

  if (performer.userId === params.authorId) {
    throw new Error('Нельзя оценивать собственный профиль.');
  }

  await prisma.performerReview.upsert({
    where: {
      performerId_authorId: {
        performerId: params.performerId,
        authorId: params.authorId
      }
    },
    create: {
      performerId: params.performerId,
      authorId: params.authorId,
      rating: params.rating,
      comment: params.comment
    },
    update: {
      rating: params.rating,
      comment: params.comment
    }
  });

  await refreshPerformerRating(params.performerId);
}
