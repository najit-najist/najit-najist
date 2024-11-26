import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { users } from './users';

export const previewSubscriberTokens = pgTable(
  'preview_subscriber_tokens',
  withDefaultFields({
    forUserId: integer('for_user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    token: varchar('token', { length: 256 }),
  }),
);

export const previewSubscriberTokensRelations = relations(
  previewSubscriberTokens,
  ({ one }) => ({
    forUser: one(users, {
      fields: [previewSubscriberTokens.forUserId],
      references: [users.id],
    }),
  }),
);
