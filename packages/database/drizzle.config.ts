import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  schema: './src/models/**/*',
  out: './drizzle',
  dialect: 'postgresql',
  // driver: 'aws-data-api',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
