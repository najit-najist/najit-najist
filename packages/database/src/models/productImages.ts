import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { fileFieldType } from '../internal/types/file';
import { withDefaultFields } from '../internal/withDefaultFields';
import { products } from './products';

export const productImages = pgTable(
  'product_images',
  withDefaultFields({
    productId: integer('product_id').references(() => products.id, {
      onDelete: 'cascade',
    }),
    file: fileFieldType('file').notNull(),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
