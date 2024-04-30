import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { products } from './products';

export const productStock = pgTable(
  'product_stock',
  withDefaultFields({
    value: integer('value').notNull(),
    productId: integer('product_id').references(() => products.id, {
      onDelete: 'cascade',
    }),
  })
);

export type ProductStock = typeof productStock.$inferSelect;

export const productStocksRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),
}));
