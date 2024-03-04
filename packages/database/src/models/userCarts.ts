import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { users } from './users';

export const userCarts = pgTable('user_carts', {
  ...modelsBase,
  userId: integer('user_id').references(() => users.id),
});
