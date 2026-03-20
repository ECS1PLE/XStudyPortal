import { helpTypeLabels } from '@/lib/constants';
import { formatCurrency, formatReviewCount } from '@/lib/format';
import { ReviewForm } from '@/components/Blocks/Performers/ReviewForm';
import { ReviewList } from '@/components/Blocks/Performers/ReviewList';
import { StarRating } from '@/components/UI/StarRating';

export function PerformerProfileDetails({
  performer,
  canReview
}: {
  performer: {
    id: string;
    bio: string;
    subjects: string[];
    startingPrices: Record<string, number>;
    telegram: string | null;
    isVerified: boolean;
    ratingAverage: number;
    ratingCount: number;
    user: {
      id: string;
      name: string;
      university: string;
      course: number;
      email: string;
    };
    reviews: Array<{
      id: string;
      rating: number;
      comment: string | null;
      createdAt: string;
      author: { id: string; name: string; university: string };
    }>;
  };
  canReview: boolean;
}) {
  return (
    <div className="space-y-6">
      <section className="glass p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge">Ментор</span>
              {performer.isVerified ? <span className="badge">Проверен</span> : null}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">{performer.user.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <StarRating rating={Math.round(performer.ratingAverage)} size="base" />
              <span className="font-semibold text-slate-900">{performer.ratingAverage.toFixed(1)}</span>
              <span className="text-slate-500">{formatReviewCount(performer.ratingCount)}</span>
            </div>
            <p className="max-w-2xl text-slate-600">{performer.bio}</p>
          </div>
          <div className="glass min-w-72 p-5">
            <div className="space-y-2 text-sm text-slate-700">
              <p><b>Университет:</b> {performer.user.university}</p>
              <p><b>Курс:</b> {performer.user.course}</p>
              <p><b>Email:</b> {performer.user.email}</p>
              {performer.telegram ? <p><b>Telegram:</b> {performer.telegram}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="glass p-6">
          <h2 className="card-title mb-4">Предметы</h2>
          <div className="flex flex-wrap gap-2">
            {performer.subjects.map((subject) => (
              <span key={subject} className="badge">{subject}</span>
            ))}
          </div>
        </article>
        <article className="glass p-6">
          <h2 className="card-title mb-4">Стартовые цены</h2>
          <div className="space-y-3">
            {Object.entries(helpTypeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                <span className="max-w-[70%] text-slate-700">{label}</span>
                <span className="font-semibold text-slate-950">{formatCurrency(performer.startingPrices[key] ?? 0)}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="glass p-6">
          <h2 className="card-title mb-4">Оставить отзыв</h2>
          {canReview ? (
            <ReviewForm performerId={performer.id} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Войти под отдельным пользовательским аккаунтом, чтобы оставить отзыв. Исполнитель не может оценивать сам себя.
            </div>
          )}
        </article>
        <article className="glass p-6">
          <h2 className="card-title mb-4">Отзывы студентов</h2>
          <ReviewList reviews={performer.reviews} />
        </article>
      </section>
    </div>
  );
}
