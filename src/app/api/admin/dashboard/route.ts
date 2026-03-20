import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth/session';
import { getAdminDashboardData } from '@/server/services/admin';

export const runtime = 'nodejs';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Недостаточно прав.' }, { status: 403 });
  }

  const data = await getAdminDashboardData();
  return NextResponse.json(data);
}
