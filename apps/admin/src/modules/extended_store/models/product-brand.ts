import { InferTypeOf } from '@medusajs/framework/types';
import { model } from '@medusajs/framework/utils';

export const ProductBrand = model.define('product_brand', {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  slug: model.text().unique(),
  url: model.text().nullable(),
});

export type ProductBrandType = InferTypeOf<typeof ProductBrand>;

export type CreateProductBrandOptions = Omit<
  InferTypeOf<typeof ProductBrand>,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'slug'
>;
