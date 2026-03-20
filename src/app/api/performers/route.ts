import { NextResponse } from 'next/server';
import { getPerformerCards } from '@/server/services/performers';

export const runtime = 'nodejs';

export async function GET() {
  const performers = await getPerformerCards();
  return NextResponse.json(performers);
}
