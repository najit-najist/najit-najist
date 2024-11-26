import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { users } from './users';

export const contactFormReplies = pgTable(
  'contact_form_replies',
  withDefaultFields({
    email: varchar('email', { length: 256 }).notNull(),
    firstName: varchar('firstname', { length: 256 }).notNull(),
    lastName: varchar('lastname', { length: 256 }).notNull(),
    message: varchar('message').notNull(),
    telephone: varchar('telephone_number', { length: 256 }),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
  }),
);
