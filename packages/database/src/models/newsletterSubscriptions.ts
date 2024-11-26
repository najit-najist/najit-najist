import { relations, sql } from 'drizzle-orm';
import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userNewsletters = pgTable('user_newsletters', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  enabled: boolean('enabled').default(true),
  email: varchar('email', { length: 256 }).unique().notNull(),
});

export type UserNewsletter = typeof userNewsletters.$inferSelect;

export const userNewslettersRelations = relations(
  userNewsletters,
  ({ one }) => ({
    user: one(users, {
      fields: [userNewsletters.email],
      references: [users.email],
    }),
  }),
);
