import { InferTypeOf } from '@medusajs/framework/types';
import { model } from '@medusajs/framework/utils';

export const ProductAlergen = model.define('product_alergen', {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  slug: model.text().unique(),
  description: model.text().nullable(),
});

export type ProductAlergenType = InferTypeOf<typeof ProductAlergen>;
