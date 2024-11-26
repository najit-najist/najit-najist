import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { couponsForProductCategories } from './couponsForProductCategories';
import { products } from './products';

export const productCategories = pgTable(
  'product_categories',
  withDefaultFields({
    name: varchar('title', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
  }),
);

export const productCategoriesRelations = relations(
  productCategories,
  ({ many }) => ({
    products: many(products),
    onlyForCoupons: many(couponsForProductCategories),
  }),
);

export type ProductCategory = typeof productCategories.$inferSelect;
