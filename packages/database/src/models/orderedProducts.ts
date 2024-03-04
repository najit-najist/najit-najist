import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { products } from './products';

export const orderedProducts = pgTable('ordered_products', {
  ...modelsBase,
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  count: integer('count').notNull(),
  totalPrice: integer('total_price').notNull(),
});
