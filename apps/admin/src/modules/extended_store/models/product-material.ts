import { model } from '@medusajs/framework/utils';

export const ProductMaterial = model.define('product_material', {
  id: model.id().primaryKey(),
  name: model.text(),
});
