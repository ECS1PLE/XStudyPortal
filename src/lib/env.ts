import 'server-only';
import { z } from 'zod';

function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function stripWrappingQuotes(value: string | undefined) {
  if (!value) return value;

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  OPENROUTER_API_KEY: z.string().optional(),
  API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional(),
  OPENROUTER_REFERER: z.string().url().optional(),
  OPENROUTER_TITLE: z.string().optional()
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getServerEnv() {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse({
    DATABASE_URL: stripWrappingQuotes(
      firstNonEmpty(
        process.env.DATABASE_URL,
        process.env.govno_POSTGRES_PRISMA_URL,
        process.env.govno_POSTGRES_URL,
        process.env.govno_DATABASE_URL
      )
    ),
    DIRECT_DATABASE_URL: stripWrappingQuotes(
      firstNonEmpty(
        process.env.DIRECT_DATABASE_URL,
        process.env.SHADOW_DATABASE_URL,
        process.env.govno_DATABASE_URL_UNPOOLED
      )
    ),
    JWT_SECRET: stripWrappingQuotes(process.env.JWT_SECRET),
    OPENROUTER_API_KEY: stripWrappingQuotes(process.env.OPENROUTER_API_KEY),
    API_KEY: stripWrappingQuotes(process.env.API_KEY),
    OPENROUTER_MODEL: stripWrappingQuotes(process.env.OPENROUTER_MODEL),
    OPENROUTER_REFERER: stripWrappingQuotes(process.env.OPENROUTER_REFERER),
    OPENROUTER_TITLE: stripWrappingQuotes(process.env.OPENROUTER_TITLE)
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment: ${message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}