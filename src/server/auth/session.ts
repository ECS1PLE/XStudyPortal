import { getSessionPayload } from '@/lib/auth';
import { prisma } from '@/server/db/prisma';

export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    university: user.university,
    course: user.course
  };
}
