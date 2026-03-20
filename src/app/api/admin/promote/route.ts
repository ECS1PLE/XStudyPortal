import { NextResponse } from 'next/server';
import { adminPromoteSchema } from '@/lib/validators';
import { getCurrentUser } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Недостаточно прав.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = adminPromoteSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: data.userId },
      data: { role: 'ADMIN' }
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось выдать права администратора.' }, { status: 400 });
  }
}
