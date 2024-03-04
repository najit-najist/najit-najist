import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { products } from './products';
import { userCarts } from './userCarts';

export const userCartProducts = pgTable('user_cart_products', {
  ...modelsBase,
  cartId: integer('cart_id')
    .references(() => userCarts.id)
    .notNull(),
  count: integer('count').notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
});
