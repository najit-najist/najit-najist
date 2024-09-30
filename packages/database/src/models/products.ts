import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { withOwnableFields } from '../internal/withOwnableFields';
import { couponsForProducts } from './couponsForProducts';
import { orderDeliveryMethods } from './orderDeliveryMethods';
import { productAlergensToProducts } from './productAlergensToProducts';
import { productCategories } from './productCategories';
import { productDiscounts } from './productDiscounts';
import { productImages } from './productImages';
import { productRawMaterialsToProducts } from './productRawMaterialsToProducts';
import { productStock } from './productStock';

export const products = pgTable(
  'products',
  withOwnableFields(
    withDefaultFields({
      name: varchar('name', { length: 256 }).unique().notNull(),
      slug: varchar('slug', { length: 256 }).unique().notNull(),
      price: integer('price').default(0).notNull(),
      description: text('description'),
      publishedAt: timestamp('published_at'),
      categoryId: integer('category_id').references(
        () => productCategories.id,
        {
          onDelete: 'restrict',
        },
      ),
      onlyForDeliveryMethodId: integer(
        'only_for_delivery_method_id',
      ).references(() => orderDeliveryMethods.id, { onDelete: 'cascade' }),
      weight: integer('weight').default(0),
    }),
  ),
);

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
  discount: one(productDiscounts),
  stock: one(productStock),
  onlyForCoupons: many(couponsForProducts),
  composedOf: many(productRawMaterialsToProducts),
  alergens: many(productAlergensToProducts),
}));

export type Product = typeof products.$inferSelect;
