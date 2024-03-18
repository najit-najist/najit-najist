// @ts-check
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import pg from 'pg';
import * as url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const getDatabase = () => {
  dotenv.config({ path: path.join(dirname, '../../../.env') });

  if (!process.env.DATABASE_URL) {
    throw new Error('Missing connection uri in dotenv');
  }

  const client = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  return drizzle(client);
};

console.log('Migration starting!');

const db = getDatabase();

console.log('Connected to database');

await migrate(db, { migrationsFolder: path.join(dirname, '../drizzle') });

console.log('Migrations done!');
process.exit(0);
