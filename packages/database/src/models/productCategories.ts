import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { products } from './products';

export const productCategories = pgTable('product_categories', {
  ...modelsBase,
  name: varchar('title', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
});

export const productCategoriesRelations = relations(
  productCategories,
  ({ many }) => ({
    products: many(products),
  })
);

export type ProductCategory = typeof productCategories.$inferSelect;
