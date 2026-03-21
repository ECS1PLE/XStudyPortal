import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';
import { prisma } from '@/server/db/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        university: data.university,
        course: data.course,
        role: data.isPerformer ? Role.PERFORMER : Role.USER,
        performerProfile: data.isPerformer
          ? {
              create: {
                bio: data.bio ?? 'Новый исполнитель.',
                subjects: data.subjects,
                telegram: data.telegram || null,
                startingPrices: data.startingPrices
              }
            }
          : undefined
      }
    });

    await createSession({ id: user.id, email: user.email, role: user.role, name: user.name });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось зарегистрироваться.' }, { status: 400 });
  }
}
