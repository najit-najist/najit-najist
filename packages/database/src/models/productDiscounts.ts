import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { products } from './products';

export const productDiscounts = pgTable(
  'product_discounts',
  withDefaultFields({
    value: integer('value').notNull(),
    productId: integer('product_id').references(() => products.id, {
      onDelete: 'cascade',
    }),
  }),
);

export const productDiscountsRelations = relations(
  productDiscounts,
  ({ one }) => ({
    product: one(products, {
      fields: [productDiscounts.productId],
      references: [products.id],
    }),
  }),
);

export type ProductDiscount = typeof productDiscounts.$inferSelect;
