import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { ownableModel } from '../internal/ownableModel';
import { orderDeliveryMethods } from './orderDeliveryMethods';
import { productCategories } from './productCategories';
import { productImages } from './productImages';
import { productPrices } from './productPrices';
import { productStock } from './productStock';

export const products = pgTable('products', {
  ...modelsBase,
  ...ownableModel,
  name: varchar('name', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  description: text('description'),
  publishedAt: timestamp('published_at'),
  categoryId: integer('category_id').references(() => productCategories.id),
  onlyForDeliveryMethodId: integer('only_for_delivery_method_id').references(
    () => orderDeliveryMethods.id
  ),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  images: many(productImages),
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  onlyForDeliveryMethod: one(orderDeliveryMethods, {
    fields: [products.onlyForDeliveryMethodId],
    references: [orderDeliveryMethods.id],
  }),
  price: one(productPrices),
  stock: one(productStock),
}));

export type Product = typeof products.$inferSelect;
