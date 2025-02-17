import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { couponsForProductCategories } from './couponsForProductCategories';
import { products } from './products';

export const productCategories = pgTable(
  'product_categories',
  withDefaultFields({
    name: varchar('title', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
    order: serial('order'),
    parentId: integer('parent_id').references(
      (): AnyPgColumn => productCategories.id,
      {
        onDelete: 'set null',
      },
    ),
  }),
);

export const productCategoriesRelations = relations(
  productCategories,
  ({ many, one }) => ({
    products: many(products),
    onlyForCoupons: many(couponsForProductCategories),
    parentCategory: one(productCategories, {
      relationName: 'parent_to_child_category_relation',
      fields: [productCategories.id],
      references: [productCategories.parentId],
    }),
    childCategories: many(productCategories, {
      relationName: 'parent_to_child_category_relation',
    }),
  }),
);

export type ProductCategory = typeof productCategories.$inferSelect;
