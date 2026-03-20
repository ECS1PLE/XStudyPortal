'use client';

import { useState } from 'react';
import { formatReviewCount } from '@/lib/format';

type DashboardData = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    university: string;
    course: number;
    isPerformer: boolean;
  }>;
  materials: Array<{
    id: string;
    title: string;
    status: string;
    type: string;
    subject: string;
    university: string;
    author: string;
    aiModeration: unknown;
    createdAt: string;
  }>;
  performers: Array<{
    id: string;
    name: string;
    university: string;
    isVerified: boolean;
    ratingAverage: number;
    ratingCount: number;
  }>;
};

export function AdminDashboard({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const response = await fetch('/api/admin/dashboard');
    const result = await response.json();
    if (response.ok) {
      setData(result);
    }
  }

  async function promoteUser(userId: string) {
    const response = await fetch('/api/admin/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const result = await response.json();
    setMessage(result.ok ? 'Права администратора выданы.' : result.error);
    await refresh();
  }

  async function toggleVerification(performerId: string, isVerified: boolean) {
    const response = await fetch('/api/admin/performers/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ performerId, isVerified })
    });
    const result = await response.json();
    setMessage(result.ok ? 'Статус исполнителя обновлён.' : result.error);
    await refresh();
  }

  async function updateMaterial(materialId: string, status: 'APPROVED' | 'REJECTED') {
    const response = await fetch('/api/admin/materials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materialId, status })
    });
    const result = await response.json();
    setMessage(result.ok ? 'Статус материала обновлён.' : result.error);
    await refresh();
  }

  const pendingCount = data.materials.filter((item) => item.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <section className="glass p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="badge">Административная панель</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Управление пользователями и модерацией</h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Отсюда можно назначать администраторов, верифицировать менторов и проверять материалы, которые прошли через AI-фильтр.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="glass p-4 text-center">
              <div className="text-2xl font-black text-slate-950">{data.users.length}</div>
              <div className="text-sm text-slate-500">Пользователей</div>
            </div>
            <div className="glass p-4 text-center">
              <div className="text-2xl font-black text-slate-950">{data.users.filter((item) => item.role === 'ADMIN').length}</div>
              <div className="text-sm text-slate-500">Админов</div>
            </div>
            <div className="glass p-4 text-center">
              <div className="text-2xl font-black text-slate-950">{data.performers.length}</div>
              <div className="text-sm text-slate-500">Менторов</div>
            </div>
            <div className="glass p-4 text-center">
              <div className="text-2xl font-black text-slate-950">{pendingCount}</div>
              <div className="text-sm text-slate-500">На модерации</div>
            </div>
          </div>
        </div>
        {message ? <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div> : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass p-6">
          <h2 className="card-title mb-4">Пользователи</h2>
          <div className="space-y-4">
            {data.users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge">{user.role}</span>
                    {user.isPerformer ? <span className="badge">PERFORMER</span> : null}
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600">{user.university} · {user.course} курс</div>
                {user.role !== 'ADMIN' ? (
                  <button className="btn-secondary mt-4" onClick={() => promoteUser(user.id)}>Назначить админом</button>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="glass p-6">
          <h2 className="card-title mb-4">Менторы и рейтинги</h2>
          <div className="space-y-4">
            {data.performers.map((performer) => (
              <div key={performer.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{performer.name}</div>
                    <div className="text-sm text-slate-500">{performer.university}</div>
                  </div>
                  <span className="badge">{performer.isVerified ? 'Проверен' : 'Не проверен'}</span>
                </div>
                <div className="mt-3 text-sm text-slate-600">Рейтинг: {performer.ratingAverage.toFixed(1)} · {formatReviewCount(performer.ratingCount)}</div>
                <button className="btn-secondary mt-4" onClick={() => toggleVerification(performer.id, !performer.isVerified)}>
                  {performer.isVerified ? 'Снять верификацию' : 'Верифицировать'}
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="glass p-6">
        <h2 className="card-title mb-4">Материалы</h2>
        <div className="space-y-4">
          {data.materials.map((material) => (
            <div key={material.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{material.title}</div>
                  <div className="text-sm text-slate-500">{material.author} · {material.subject} · {material.university}</div>
                </div>
                <span className="badge">{material.status}</span>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">{JSON.stringify(material.aiModeration, null, 2)}</pre>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-primary" onClick={() => updateMaterial(material.id, 'APPROVED')}>Одобрить</button>
                <button className="btn-secondary" onClick={() => updateMaterial(material.id, 'REJECTED')}>Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
