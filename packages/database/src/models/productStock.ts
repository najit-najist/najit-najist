import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { products } from './products';

export const productStock = pgTable('product_stock', {
  ...modelsBase,
  value: integer('value').notNull(),
  productId: integer('product_id').references(() => products.id),
});

export const productStocksRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),
}));
