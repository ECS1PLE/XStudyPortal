import { NextResponse } from 'next/server';
import { moderateStudyMaterial } from '@/lib/moderation';
import { materialSchema } from '@/lib/validators';
import { getCurrentUser } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const materials = await prisma.studyMaterial.findMany({
    where: { status: 'APPROVED' },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(materials);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Требуется авторизация.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = materialSchema.parse(body);
    const moderation = await moderateStudyMaterial(data);

    const material = await prisma.studyMaterial.create({
      data: {
        authorId: user.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        university: data.university,
        type: data.type,
        downloadUrl: data.downloadUrl,
        status: moderation.verdict === 'allow' ? 'APPROVED' : moderation.verdict === 'block' ? 'REJECTED' : 'PENDING',
        aiModeration: moderation
      }
    });

    return NextResponse.json({ ok: true, material: { ...material, createdAt: material.createdAt.toISOString() }, moderation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось добавить материал.' }, { status: 400 });
  }
}
