import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { products } from './products';

export const productPrices = pgTable(
  'product_prices',
  withDefaultFields({
    value: integer('value').notNull(),
    discount: integer('discount'),
    productId: integer('product_id').references(() => products.id, {
      onDelete: 'cascade',
    }),
  })
);

export const productPricesRelations = relations(productPrices, ({ one }) => ({
  product: one(products, {
    fields: [productPrices.productId],
    references: [products.id],
  }),
}));

export type ProductPrice = typeof productPrices.$inferSelect;
