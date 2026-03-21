import { prisma } from '@/server/db/prisma';
import { helpTypeLabels } from '@/lib/constants';

export async function getPerformerCards() {
  const performers = await prisma.performerProfile.findMany({
    include: {
      user: true,
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { author: true }
      }
    },
    orderBy: [{ isVerified: 'desc' }, { ratingAverage: 'desc' }, { createdAt: 'desc' }]
  });

  return performers.map((profile) => ({
    id: profile.id,
    bio: profile.bio,
    subjects: profile.subjects,
    startingPrices: profile.startingPrices as Record<keyof typeof helpTypeLabels, number>,
    telegram: profile.telegram,
    isVerified: profile.isVerified,
    ratingAverage: profile.ratingAverage,
    ratingCount: profile.ratingCount,
    latestReview: profile.reviews[0]
      ? {
          rating: profile.reviews[0].rating,
          comment: profile.reviews[0].comment,
          authorName: profile.reviews[0].author.name
        }
      : null,
    user: {
      id: profile.user.id,
      name: profile.user.name,
      university: profile.user.university,
      course: profile.user.course,
      email: profile.user.email
    }
  }));
}

export async function getPerformerById(id: string) {
  const performer = await prisma.performerProfile.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: {
        include: { author: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!performer) return null;

  return {
    id: performer.id,
    bio: performer.bio,
    subjects: performer.subjects,
    startingPrices: performer.startingPrices as Record<keyof typeof helpTypeLabels, number>,
    telegram: performer.telegram,
    isVerified: performer.isVerified,
    ratingAverage: performer.ratingAverage,
    ratingCount: performer.ratingCount,
    user: {
      id: performer.user.id,
      name: performer.user.name,
      university: performer.user.university,
      course: performer.user.course,
      email: performer.user.email
    },
    reviews: performer.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      author: {
        id: review.author.id,
        name: review.author.name,
        university: review.author.university
      }
    }))
  };
}
