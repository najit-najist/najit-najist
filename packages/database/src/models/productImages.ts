import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { fileFieldType } from '../internal/types/file';
import { products } from './products';

export const productImages = pgTable('product_images', {
  ...modelsBase,
  productId: integer('product_id').references(() => products.id),
  file: fileFieldType('file').notNull(),
});
