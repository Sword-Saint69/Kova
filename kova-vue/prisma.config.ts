import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: "postgresql://neondb_owner:npg_9VQsHfhvxJS2@ep-polished-rice-ajlklfzx.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
