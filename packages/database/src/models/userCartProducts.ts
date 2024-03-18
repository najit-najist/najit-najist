import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { products } from './products';
import { userCarts } from './userCarts';

export const userCartProducts = pgTable('user_cart_products', {
  ...modelsBase,
  cartId: integer('cart_id')
    .references(() => userCarts.id, { onDelete: 'cascade' })
    .notNull(),
  count: integer('count').default(1).notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
});

export type UserCartProduct = typeof userCartProducts.$inferSelect;

export const userCartProductsRelations = relations(
  userCartProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [userCartProducts.productId],
      references: [products.id],
    }),
    cart: one(userCarts, {
      fields: [userCartProducts.cartId],
      references: [userCarts.id],
    }),
  })
);
