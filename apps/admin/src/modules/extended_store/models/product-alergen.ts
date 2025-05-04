import { model } from '@medusajs/framework/utils';

export const ProductAlergen = model.define('product_alergen', {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  slug: model.text().unique(),
  description: model.text().nullable(),
});
