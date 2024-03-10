import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { addressModelsBase } from '../internal/addressModelsBase';
import { municipalities } from './municipalities';
import { users } from './users';

export const userAddresses = pgTable('user_addresses', {
  ...addressModelsBase,
  userId: integer('user_id')
    .references(() => users.id)
    .unique()
    .notNull(),
});

export const userAddressRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
  municipality: one(municipalities, {
    fields: [userAddresses.municipalityId],
    references: [municipalities.id],
  }),
}));

export type UserAddress = typeof userAddresses.$inferSelect;
