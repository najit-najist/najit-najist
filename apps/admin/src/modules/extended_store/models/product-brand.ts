import { model } from '@medusajs/framework/utils';

export const ProductBrand = model.define('product_brand', {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  slug: model.text().unique(),
  url: model.text().nullable(),
});
