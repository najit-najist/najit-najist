import { relations } from 'drizzle-orm';
import { pgTable, integer, unique } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { coupons } from './coupons';
import { productCategories } from './productCategories';

export const couponsForProductCategories = pgTable(
  'coupons_for_product_categories',
  withDefaultFields({
    couponId: integer('coupon_id')
      .references(() => coupons.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: integer('category_id')
      .references(() => productCategories.id, { onDelete: 'cascade' })
      .notNull(),
  }),
  (schema) => ({
    uniqueCouponCategoryCombination: unique(
      'unique_coupon_category_combination',
    ).on(schema.couponId, schema.categoryId),
  }),
);

export const couponsForProductCategoriesRelations = relations(
  couponsForProductCategories,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponsForProductCategories.couponId],
      references: [coupons.id],
    }),
    category: one(productCategories, {
      fields: [couponsForProductCategories.categoryId],
      references: [productCategories.id],
    }),
  }),
);

export type CouponsForProductCategory =
  typeof couponsForProductCategories.$inferSelect;
