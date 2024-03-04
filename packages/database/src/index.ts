import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './models';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL env variable');
}

const queryClient = postgres(databaseUrl);
export const database = drizzle(queryClient, {
  schema,
});
