import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { products } from './products';

export const productPrices = pgTable('product_prices', {
  ...modelsBase,
  value: integer('value').notNull(),
  discount: integer('discount'),
  productId: integer('product_id').references(() => products.id),
});
