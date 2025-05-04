import { model } from '@medusajs/framework/utils';

export const RecipeCategory = model.define('recipe_category', {
  id: model.id().primaryKey(),
  title: model.text().unique(),
  slug: model.text().unique(),
});
