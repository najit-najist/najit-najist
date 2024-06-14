import { relations } from 'drizzle-orm';
import { pgTable, integer, unique } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { coupons } from './coupons';
import { products } from './products';

export const couponsForProducts = pgTable(
  'coupons_for_products',
  withDefaultFields({
    couponId: integer('coupon_id')
      .references(() => coupons.id, { onDelete: 'cascade' })
      .notNull(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
  }),
  (schema) => ({
    uniqueCouponProductCombination: unique(
      'unique_coupon_product_combination'
    ).on(schema.couponId, schema.productId),
  })
);

export const couponsForProductsRelations = relations(
  couponsForProducts,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponsForProducts.couponId],
      references: [coupons.id],
    }),
    product: one(products, {
      fields: [couponsForProducts.productId],
      references: [products.id],
    }),
  })
);

export type CouponForProduct = typeof couponsForProducts.$inferSelect;
