'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { helpTypeLabels } from '@/lib/constants';
import { formatCurrency, formatReviewCount } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetFilters, setFilters } from '@/store/slices/search-slice';
import { StarRating } from '@/components/UI/StarRating';

type Performer = {
  id: string;
  bio: string;
  subjects: string[];
  startingPrices: Record<string, number>;
  telegram: string | null;
  isVerified: boolean;
  ratingAverage: number;
  ratingCount: number;
  latestReview: { rating: number; comment: string | null; authorName: string } | null;
  user: {
    id: string;
    name: string;
    university: string;
    course: number;
    email: string;
  };
};

export function PerformerExplorer({ initialPerformers }: { initialPerformers: Performer[] }) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search);

  const universities = useMemo(
    () => Array.from(new Set(initialPerformers.map((item) => item.user.university))).sort(),
    [initialPerformers]
  );

  const filtered = useMemo(() => {
    const result = initialPerformers.filter((item) => {
      const price = item.startingPrices[filters.helpType || 'LAB_GUIDANCE'] ?? 0;
      const matchesUniversity = !filters.university || item.user.university === filters.university;
      const matchesSubject = !filters.subject || item.subjects.some((subject) => subject.toLowerCase().includes(filters.subject.toLowerCase()));
      const matchesMin = filters.minPrice === '' || price >= Number(filters.minPrice);
      const matchesMax = filters.maxPrice === '' || price <= Number(filters.maxPrice);
      return matchesUniversity && matchesSubject && matchesMin && matchesMax;
    });

    return result.sort((left, right) => {
      const leftPrice = left.startingPrices[filters.helpType || 'LAB_GUIDANCE'] ?? 0;
      const rightPrice = right.startingPrices[filters.helpType || 'LAB_GUIDANCE'] ?? 0;

      switch (filters.sortBy) {
        case 'priceAsc':
          return leftPrice - rightPrice;
        case 'priceDesc':
          return rightPrice - leftPrice;
        case 'latest':
          return right.id.localeCompare(left.id);
        default:
          return right.ratingAverage - left.ratingAverage || right.ratingCount - left.ratingCount;
      }
    });
  }, [filters.helpType, filters.maxPrice, filters.minPrice, filters.sortBy, filters.subject, filters.university, initialPerformers]);

  return (
    <div className="space-y-6">
      <section className="glass p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="badge">Поиск исполнителей</div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Каталог менторов и консультантов</h1>
            <p className="max-w-3xl text-slate-600">
              Фильтруйте специалистов по университету, диапазону стартовой цены, предмету и формату помощи.
              Рейтинг формируется из отзывов студентов и отображается в карточке и полном профиле.
            </p>
          </div>
          <button className="btn-secondary" onClick={() => dispatch(resetFilters())}>Сбросить фильтры</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div>
            <label className="label">Университет</label>
            <select className="select" value={filters.university} onChange={(e) => dispatch(setFilters({ university: e.target.value }))}>
              <option value="">Все</option>
              {universities.map((university) => (
                <option key={university} value={university}>{university}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Предмет</label>
            <input className="input" value={filters.subject} onChange={(e) => dispatch(setFilters({ subject: e.target.value }))} placeholder="Например, SQL" />
          </div>
          <div>
            <label className="label">От</label>
            <input className="input" type="number" value={filters.minPrice} onChange={(e) => dispatch(setFilters({ minPrice: e.target.value }))} placeholder="500" />
          </div>
          <div>
            <label className="label">До</label>
            <input className="input" type="number" value={filters.maxPrice} onChange={(e) => dispatch(setFilters({ maxPrice: e.target.value }))} placeholder="5000" />
          </div>
          <div>
            <label className="label">Тип помощи</label>
            <select className="select" value={filters.helpType} onChange={(e) => dispatch(setFilters({ helpType: e.target.value }))}>
              {Object.entries(helpTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Сортировка</label>
            <select className="select" value={filters.sortBy} onChange={(e) => dispatch(setFilters({ sortBy: e.target.value as typeof filters.sortBy }))}>
              <option value="rating">По рейтингу</option>
              <option value="priceAsc">Цена ↑</option>
              <option value="priceDesc">Цена ↓</option>
              <option value="latest">Новые</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const price = item.startingPrices[filters.helpType || 'LAB_GUIDANCE'];
          return (
            <article key={item.id} className="glass flex h-full flex-col p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="badge">{item.user.university}</span>
                <span className="badge">{item.user.course} курс</span>
                {item.isVerified ? <span className="badge">Проверен</span> : null}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="card-title">{item.user.name}</h2>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={Math.round(item.ratingAverage)} size="sm" />
                    <span className="text-sm font-semibold text-slate-700">{item.ratingAverage.toFixed(1)}</span>
                    <span className="text-sm text-slate-500">· {formatReviewCount(item.ratingCount)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 max-h-28 overflow-hidden text-sm leading-7 text-slate-600">{item.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.subjects.slice(0, 4).map((subject) => (
                  <span key={subject} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{subject}</span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Стартовая цена</div>
                <div className="mt-1 text-2xl font-black text-slate-950">{formatCurrency(price || 0)}</div>
              </div>
              {item.latestReview?.comment ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Последний отзыв</div>
                  “{item.latestReview.comment}”
                </div>
              ) : null}
              <div className="mt-6">
                <Link href={`/performers/${item.id}`} className="btn-primary w-full">Открыть профиль</Link>
              </div>
            </article>
          );
        })}
      </section>

      {filtered.length === 0 ? (
        <div className="glass p-8 text-center text-slate-600">По текущим фильтрам исполнители не найдены.</div>
      ) : null}
    </div>
  );
}
