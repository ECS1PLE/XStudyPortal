import { formatDate } from '@/lib/format';
import { StarRating } from '@/components/UI/StarRating';

export function ReviewList({
  reviews
}: {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: { id: string; name: string; university: string };
  }>;
}) {
  if (reviews.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">Пока нет отзывов.</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">{review.author.name}</div>
              <div className="text-sm text-slate-500">{review.author.university}</div>
            </div>
            <div className="text-right">
              <StarRating rating={review.rating} size="sm" />
              <div className="mt-1 text-xs text-slate-500">{formatDate(review.createdAt)}</div>
            </div>
          </div>
          {review.comment ? <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p> : null}
        </article>
      ))}
    </div>
  );
}
