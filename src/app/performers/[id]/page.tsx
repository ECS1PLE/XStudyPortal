import { notFound } from 'next/navigation';
import { PerformerProfileDetails } from '@/components/Blocks/Performers/PerformerProfileDetails';
import { getCurrentUser } from '@/server/auth/session';
import { getPerformerById } from '@/server/services/performers';

export const dynamic = 'force-dynamic';

export default async function PerformerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [performer, currentUser] = await Promise.all([getPerformerById(id), getCurrentUser()]);

  if (!performer) {
    notFound();
  }

  const canReview = Boolean(currentUser && currentUser.id !== performer.user.id);

  return <PerformerProfileDetails performer={performer} canReview={canReview} />;
}
