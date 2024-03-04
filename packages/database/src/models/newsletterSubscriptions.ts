import { sql } from 'drizzle-orm';
import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userNewsletters = pgTable('user_newsletters', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  enabled: boolean('enabled').default(true),
  email: varchar('email', { length: 256 }).unique().notNull(),
});
