import Link from 'next/link';
import { HeroLottie } from '@/components/Main/HeroLottie';
import { getCurrentUser } from '@/server/auth/session';
import { helpTypeLabels } from '@/lib/constants';

const features = [
  {
    title: 'Каталог менторов с рейтингами',
    text: 'Поиск специалистов по университету, предмету, цене и формату помощи — плюс отзывы и средняя оценка.'
  },
  {
    title: 'Раздел учебных материалов',
    text: 'Студенты публикуют шаблоны, конспекты, памятки и примеры кода. Перед публикацией всё проходит AI-проверку.'
  },
  {
    title: 'ИИ-помощник прямо в портале',
    text: 'Быстрые подсказки по предметам, структуре отчёта, подготовке к защите или плану изучения темы.'
  }
];

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <section className="glass grid gap-8 overflow-hidden p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div className="space-y-6">
          <div className="badge">Похоже на современный университетский портал</div>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Студенческий <span className="gradient-text">support‑портал</span> с рейтингами менторов и безопасной учебной помощью.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Логин, регистрация, каталог исполнителей в формате консультаций и менторства, публичные отзывы,
            раздел материалов, AI‑панель и административная модерация — всё на Next.js, TypeScript и PostgreSQL.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/performers" className="btn-primary">Найти ментора</Link>
            <Link href="/materials" className="btn-secondary">Открыть материалы</Link>
          </div>
          {user ? (
            <div className="rounded-3xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-900">
              Вы вошли как <b>{user.name}</b> ({user.role}). Можете публиковать материалы, писать отзывы и использовать AI-чат.
            </div>
          ) : null}
        </div>
        <HeroLottie />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="glass p-6">
            <h2 className="card-title">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="glass p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="badge">Форматы помощи</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Только безопасные учебные сценарии</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(helpTypeLabels).map(([key, label]) => (
            <div key={key} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{key}</div>
              <div className="mt-3 font-semibold text-slate-900">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
