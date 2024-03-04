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

export const products = pgTable('products', {
  ...modelsBase,
  ...ownableModel,
  name: varchar('name', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  description: text('description'),
  publishedAt: timestamp('published_at'),
  categoryId: integer('category_id')
    .references(() => productCategories.id)
    .notNull(),
  onlyForDeliveryMethodId: integer('only_for_delivery_method_id').references(
    () => orderDeliveryMethods.id
  ),
});
