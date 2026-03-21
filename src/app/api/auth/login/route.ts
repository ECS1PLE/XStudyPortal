import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';
import { prisma } from '@/server/db/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ error: 'Неверный email или пароль.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Неверный email или пароль.' }, { status: 401 });
    }

    await createSession({ id: user.id, email: user.email, role: user.role, name: user.name });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось войти.' }, { status: 400 });
  }
}
