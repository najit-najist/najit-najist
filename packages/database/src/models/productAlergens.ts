import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { productRawMaterialsToProducts } from './productRawMaterialsToProducts';

export const productAlergens = pgTable(
  'product_alergens',
  withDefaultFields({
    name: varchar('name', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
    description: varchar('description'),
  }),
);

export const productAlergensRelations = relations(
  productAlergens,
  ({ many }) => ({
    toProducts: many(productRawMaterialsToProducts),
  }),
);
