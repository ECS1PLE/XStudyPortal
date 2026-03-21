'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultStartingPrices, helpTypeLabels } from '@/lib/constants';

type Mode = 'login' | 'register';

const initialRegisterForm = {
  name: '',
  email: '',
  password: '',
  university: '',
  course: 1,
  isPerformer: false,
  bio: '',
  subjects: '',
  telegram: '',
  startingPrices: { ...defaultStartingPrices }
};

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);

  const title = useMemo(() => (mode === 'login' ? 'Вход в портал' : 'Создание аккаунта'), [mode]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload =
        mode === 'login'
          ? loginForm
          : {
              ...registerForm,
              course: Number(registerForm.course),
              subjects: registerForm.subjects
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean),
              startingPrices: Object.fromEntries(
                Object.entries(registerForm.startingPrices).map(([key, value]) => [key, Number(value)])
              )
            };

      const response = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось выполнить запрос.');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Произошла ошибка.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass p-8">
      <div className="mb-6 space-y-2">
        <div className="badge">Auth</div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="text-slate-600">
          {mode === 'login'
            ? 'Войдите, чтобы публиковать материалы, писать отзывы и использовать AI-помощника.'
            : 'Зарегистрируйтесь как студент или как ментор-консультант с публичным профилем и рейтингом.'}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {mode === 'register' ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Имя</label>
                <input className="input" value={registerForm.name} onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={registerForm.email} onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Пароль</label>
                <input className="input" type="password" value={registerForm.password} onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Университет</label>
                <input className="input" value={registerForm.university} onChange={(e) => setRegisterForm((prev) => ({ ...prev, university: e.target.value }))} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Курс</label>
                <input className="input" type="number" min={1} max={6} value={registerForm.course} onChange={(e) => setRegisterForm((prev) => ({ ...prev, course: Number(e.target.value) }))} required />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={registerForm.isPerformer} onChange={(e) => setRegisterForm((prev) => ({ ...prev, isPerformer: e.target.checked }))} />
                Зарегистрироваться как исполнитель
              </label>
            </div>

            {registerForm.isPerformer ? (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <label className="label">О себе</label>
                  <textarea className="input min-h-28" value={registerForm.bio} onChange={(e) => setRegisterForm((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Опишите специализацию, формат работы и опыт." />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label">Предметы</label>
                    <input className="input" value={registerForm.subjects} onChange={(e) => setRegisterForm((prev) => ({ ...prev, subjects: e.target.value }))} placeholder="SQL, JavaScript, Физика" />
                  </div>
                  <div>
                    <label className="label">Telegram</label>
                    <input className="input" value={registerForm.telegram} onChange={(e) => setRegisterForm((prev) => ({ ...prev, telegram: e.target.value }))} placeholder="@username" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(helpTypeLabels).map(([key, label]) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <input
                        className="input"
                        type="number"
                        min={0}
                        value={registerForm.startingPrices[key as keyof typeof registerForm.startingPrices]}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            startingPrices: {
                              ...prev.startingPrices,
                              [key]: Number(e.target.value)
                            }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={loginForm.email} onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Пароль</label>
              <input className="input" type="password" value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} required />
            </div>
          </>
        )}

        {message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div> : null}

        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Отправляем...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </form>
    </section>
  );
}
