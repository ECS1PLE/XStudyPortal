import { AdminDashboard } from '@/components/Blocks/Admin/AdminDashboard';
import { getCurrentUser } from '@/server/auth/session';
import { getAdminDashboardData } from '@/server/services/admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="glass mx-auto max-w-2xl p-8 text-center">
        <h1 className="mb-3 text-2xl font-bold">Доступ запрещён</h1>
        <p className="text-slate-600">Раздел доступен только администраторам.</p>
      </div>
    );
  }

  const payload = await getAdminDashboardData();
  return <AdminDashboard initialData={payload} />;
}
