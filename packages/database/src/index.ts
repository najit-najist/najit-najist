import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import * as schema from './models';

const { OrderState, UserRoles, UserStates, ...actualSchema } = schema;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL env variable');
}

const queryClient = new pg.Pool({
  connectionString: databaseUrl,
});

export const database = drizzle(queryClient, {
  schema: actualSchema,
});
