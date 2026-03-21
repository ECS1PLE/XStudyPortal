import Link from 'next/link';
import { getCurrentUser } from '@/server/auth/session';
import { LogoutButton } from '@/components/Main/LogoutButton';

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-white/30 bg-white/70 backdrop-blur">
      <div className="container-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-black text-white">SP</div>
            <div>
              <div className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">Student Portal</div>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          <Link href="/performers" className="rounded-xl px-3 py-2 hover:bg-slate-100">Менторы</Link>
          <Link href="/materials" className="rounded-xl px-3 py-2 hover:bg-slate-100">Материалы</Link>
          <Link href="/ai-assistant" className="rounded-xl px-3 py-2 hover:bg-slate-100">AI-чат</Link>
          {user?.role === 'ADMIN' ? <Link href="/admin" className="rounded-xl px-3 py-2 hover:bg-slate-100">Админка</Link> : null}
          {user ? (
            <div className="ml-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.role}</div>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">Войти</Link>
              <Link href="/register" className="btn-primary">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
