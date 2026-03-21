import { NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/env';

export async function GET() {
  try {
    const env = getServerEnv();
    const url = new URL(env.DATABASE_URL);

    return NextResponse.json({
      ok: true,
      hostname: url.hostname,
      pathname: url.pathname,
      username: url.username,
      startsWithQuote: env.DATABASE_URL.startsWith('"') || env.DATABASE_URL.startsWith("'"),
      endsWithQuote: env.DATABASE_URL.endsWith('"') || env.DATABASE_URL.endsWith("'"),
      hasDirectDatabaseUrl: Boolean(env.DIRECT_DATABASE_URL),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}