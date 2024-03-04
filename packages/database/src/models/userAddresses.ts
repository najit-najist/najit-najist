import { integer, pgTable } from 'drizzle-orm/pg-core';

import { addressModelsBase } from '../internal/addressModelsBase';
import { users } from './users';

export const userAddresses = pgTable('user_addresses', {
  ...addressModelsBase,
  userId: integer('user_id')
    .references(() => users.id)
    .unique()
    .notNull(),
});
