import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { productRawMaterialsToProducts } from './productRawMaterialsToProducts';

export const productRawMaterials = pgTable(
  'product_raw_materials',
  withDefaultFields({
    name: varchar('name', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
  }),
);

export const productCompositionItemsRelations = relations(
  productRawMaterials,
  ({ many }) => ({
    partOf: many(productRawMaterialsToProducts),
  }),
);

export type ProductRawMaterial = typeof productRawMaterials.$inferSelect;
