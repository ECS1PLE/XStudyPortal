'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ReviewForm({ performerId }: { performerId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/performers/${performerId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось сохранить отзыв.');
      }

      setMessage('Отзыв сохранён.');
      setComment('');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Произошла ошибка.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <div className="label">Оценка</div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={value <= rating ? 'text-3xl text-amber-400' : 'text-3xl text-slate-300'}
              aria-label={`Оценка ${value}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Комментарий</label>
        <textarea className="input min-h-28" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Что было полезно в консультации?" />
      </div>
      {message ? <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div> : null}
      <button disabled={loading} className="btn-primary">{loading ? 'Сохраняем...' : 'Оставить отзыв'}</button>
    </form>
  );
}
