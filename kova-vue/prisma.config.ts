import { defineConfig } from '@prisma/config';
import fs from 'node:fs';
import path from 'node:path';

// Manually load .env since Prisma 7's config doesn't always load it automatically
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const databaseUrlMatch = envContent.match(/DATABASE_URL=["']?(.+?)["']?(\s|$)/);
const databaseUrl = databaseUrlMatch ? databaseUrlMatch[1] : process.env.DATABASE_URL;

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
