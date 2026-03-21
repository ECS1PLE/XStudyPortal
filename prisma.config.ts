import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

if (!process.env.DIRECT_DATABASE_URL && process.env.govno_DATABASE_URL_UNPOOLED) {
  process.env.DIRECT_DATABASE_URL = process.env.govno_DATABASE_URL_UNPOOLED;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_DATABASE_URL'),
  },
});