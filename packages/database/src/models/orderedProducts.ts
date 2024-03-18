import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { orders } from './orders';
import { products } from './products';

export const orderedProducts = pgTable('ordered_products', {
  ...modelsBase,
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'restrict' })
    .notNull(),
  count: integer('count').notNull(),
  totalPrice: integer('total_price').notNull(),
});

export const orderedProductsRelations = relations(
  orderedProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [orderedProducts.productId],
      references: [products.id],
    }),
    order: one(orders, {
      fields: [orderedProducts.orderId],
      references: [orders.id],
    }),
  })
);

export type OrderedProduct = typeof orderedProducts.$inferSelect;
