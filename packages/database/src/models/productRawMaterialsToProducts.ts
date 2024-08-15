import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { productRawMaterials } from './productRawMaterials';
import { products } from './products';

export const productRawMaterialsToProducts = pgTable(
  'product_raw_materials_to_products',
  {
    id: serial('id').primaryKey(),
    rawMaterialId: integer('raw_material_id')
      .references(() => productRawMaterials.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    productId: integer('product_id')
      .references(() => products.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    notes: varchar('notes'),
    order: integer('order').notNull(),
    description: varchar('description'),
  },
  (schema) => ({
    uniqueMaterialToProductCombination: uniqueIndex(
      'unique_material_to_product_combination',
    ).on(schema.productId, schema.rawMaterialId),
  }),
);

export const productRawMaterialsToProductsRelations = relations(
  productRawMaterialsToProducts,
  ({ one }) => ({
    rawMaterial: one(productRawMaterials, {
      fields: [productRawMaterialsToProducts.rawMaterialId],
      references: [productRawMaterials.id],
    }),
    product: one(products, {
      fields: [productRawMaterialsToProducts.productId],
      references: [products.id],
    }),
  }),
);
