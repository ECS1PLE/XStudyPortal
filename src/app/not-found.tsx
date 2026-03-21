import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="glass mx-auto max-w-2xl p-10 text-center">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Страница не найдена</h1>
      <p className="mt-3 text-slate-600">Похоже, ссылка устарела или объект был удалён.</p>
      <Link href="/" className="btn-primary mt-6">На главную</Link>
    </div>
  );
}
