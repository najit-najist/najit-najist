import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { userCartProducts } from './userCartProducts';
import { users } from './users';

export const userCarts = pgTable('user_carts', {
  ...modelsBase,
  userId: integer('user_id').references(() => users.id),
});

export const userCartsRelations = relations(userCarts, ({ one, many }) => ({
  user: one(users, {
    fields: [userCarts.userId],
    references: [users.id],
  }),
  products: many(userCartProducts),
}));
