import { boolean, pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';

export const outgoingEmailMessages = pgTable(
  'outgoing_email_messages',
  withDefaultFields({
    from: varchar('from').notNull(),
    to: varchar('to').notNull(),
    htmlBody: varchar('html_body').notNull(),
    subject: varchar('subject').notNull(),
    didSend: boolean('did_send').default(false),
  }),
);

export type OutgoingEmailMessage = typeof outgoingEmailMessages.$inferSelect;
