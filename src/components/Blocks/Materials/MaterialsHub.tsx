'use client';

import { useMemo, useState } from 'react';
import { materialTypeLabels } from '@/lib/constants';
import { formatDate } from '@/lib/format';

type Material = {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  type: string;
  status: string;
  downloadUrl: string;
  createdAt: string;
  author: string;
};

const materialTypes = Object.entries(materialTypeLabels).map(([value, label]) => ({ value, label }));

export function MaterialsHub({
  initialMaterials,
  canUpload
}: {
  initialMaterials: Material[];
  canUpload: boolean;
}) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    university: '',
    type: materialTypes[0]?.value ?? 'NOTES',
    downloadUrl: ''
  });

  const recent = useMemo(() => materials.slice(0, 12), [materials]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось добавить материал.');
      }

      setStatusMessage(
        result.moderation?.verdict === 'allow'
          ? 'Материал опубликован.'
          : result.moderation?.verdict === 'review'
            ? 'Материал отправлен на ручную модерацию.'
            : 'Материал отклонён модерацией.'
      );

      if (result.material?.status === 'APPROVED') {
        setMaterials((prev) => [
          {
            ...result.material,
            createdAt: result.material.createdAt,
            author: 'Вы'
          },
          ...prev
        ]);
      }

      setForm({
        title: '',
        description: '',
        subject: '',
        university: '',
        type: materialTypes[0]?.value ?? 'NOTES',
        downloadUrl: ''
      });
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Произошла ошибка.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass p-8">
        <div className="mb-6 space-y-2">
          <div className="badge">Материалы</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">База полезных учебных материалов</h1>
          <p className="max-w-3xl text-slate-600">
            Сюда можно добавлять конспекты, шаблоны, гайды, презентации и примеры кода. Перед публикацией материал проходит AI-проверку.
          </p>
        </div>

        {canUpload ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Название</label>
                <input className="input" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Предмет</label>
                <input className="input" value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} required />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Университет</label>
                <input className="input" value={form.university} onChange={(e) => setForm((prev) => ({ ...prev, university: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Тип материала</label>
                <select className="select" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                  {materialTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Описание</label>
              <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Ссылка на материал</label>
              <input className="input" type="url" value={form.downloadUrl} onChange={(e) => setForm((prev) => ({ ...prev, downloadUrl: e.target.value }))} required />
            </div>
            {statusMessage ? <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{statusMessage}</div> : null}
            <button disabled={isSubmitting} className="btn-primary w-full md:w-fit">
              {isSubmitting ? 'Проверяем...' : 'Добавить материал'}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Чтобы добавлять материалы, войдите в аккаунт.
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recent.map((item) => (
          <article key={item.id} className="glass flex h-full flex-col p-6">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="badge">{materialTypeLabels[item.type as keyof typeof materialTypeLabels] ?? item.type}</span>
              <span className="badge">{item.university}</span>
            </div>
            <h2 className="card-title">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            <div className="mt-4 space-y-1 text-sm text-slate-500">
              <div>Предмет: {item.subject}</div>
              <div>Автор: {item.author}</div>
              <div>Дата: {formatDate(item.createdAt)}</div>
            </div>
            <div className="mt-6">
              <a href={item.downloadUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">Открыть материал</a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
