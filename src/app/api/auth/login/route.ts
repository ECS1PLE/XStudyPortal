import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';
import { prisma } from '@/server/db/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль.' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль.' },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('LOGIN_ERROR:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Некорректные данные формы.',
          issues: error.flatten()
        },
        { status: 400 }
      );
    }

    const code =
      error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof (error as { code?: unknown }).code === 'string'
        ? (error as { code: string }).code
        : null;

    if (code === 'P1000' || code === 'P1001' || code === 'P1002') {
      return NextResponse.json(
        { error: 'База данных временно недоступна.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Не удалось войти.'
      },
      { status: 500 }
    );
  }
}