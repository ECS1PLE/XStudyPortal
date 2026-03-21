import { NextResponse } from 'next/server';
import { adminMaterialSchema } from '@/lib/validators';
import { getCurrentUser } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export const runtime = 'nodejs';

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Недостаточно прав.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = adminMaterialSchema.parse(body);

    const material = await prisma.studyMaterial.update({
      where: { id: data.materialId },
      data: {
        status: data.status,
        moderatorId: currentUser.id
      }
    });

    return NextResponse.json({ ok: true, material });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось обновить статус материала.' }, { status: 400 });
  }
}
