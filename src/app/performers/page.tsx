import { PerformerExplorer } from '@/components/Blocks/Performers/PerformerExplorer';
import { getPerformerCards } from '@/server/services/performers';

export const dynamic = 'force-dynamic';

export default async function PerformersPage() {
  const performers = await getPerformerCards();
  return <PerformerExplorer initialPerformers={performers} />;
}
