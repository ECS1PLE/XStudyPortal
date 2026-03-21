import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  SHADOW_DATABASE_URL: z.string().optional(),
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
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    API_KEY: process.env.API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    OPENROUTER_REFERER: process.env.OPENROUTER_REFERER,
    OPENROUTER_TITLE: process.env.OPENROUTER_TITLE
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid environment: ${message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
