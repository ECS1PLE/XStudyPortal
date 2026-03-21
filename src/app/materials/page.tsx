import { MaterialsHub } from '@/components/Blocks/Materials/MaterialsHub';
import { getCurrentUser } from '@/server/auth/session';
import { getApprovedMaterials } from '@/server/services/materials';

export const dynamic = 'force-dynamic';

export default async function MaterialsPage() {
  const [materials, user] = await Promise.all([getApprovedMaterials(), getCurrentUser()]);
  return <MaterialsHub initialMaterials={materials} canUpload={Boolean(user)} />;
}
