import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';
import { performerVerifySchema } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Недостаточно прав.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = performerVerifySchema.parse(body);

    const performer = await prisma.performerProfile.update({
      where: { id: data.performerId },
      data: { isVerified: data.isVerified }
    });

    return NextResponse.json({ ok: true, performer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось обновить статус исполнителя.' }, { status: 400 });
  }
}
