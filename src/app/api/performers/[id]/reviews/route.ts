import { NextResponse } from 'next/server';
import { performerReviewSchema } from '@/lib/validators';
import { getCurrentUser } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';
import { upsertPerformerReview } from '@/server/services/reviews';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = await prisma.performerReview.findMany({
    where: { performerId: id },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(
    reviews.map((review) => ({
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
  );
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Требуется авторизация.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = performerReviewSchema.parse(body);

    await upsertPerformerReview({
      performerId: id,
      authorId: user.id,
      rating: data.rating,
      comment: data.comment
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Не удалось сохранить отзыв.' }, { status: 400 });
  }
}
