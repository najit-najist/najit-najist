// @ts-check
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';
import * as url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const getDatabase = () => {
  dotenv.config({ path: path.join(dirname, '../../../.env') });

  if (!process.env.DATABASE_URL) {
    throw new Error('Missing connection uri in dotenv');
  }

  return drizzle(postgres(process.env.DATABASE_URL));
};

console.log('Migration starting!');

const db = getDatabase();

console.log('Connected to database');

await migrate(db, { migrationsFolder: path.join(dirname, '../drizzle') });

console.log('Migrations done!');
process.exit(0);
