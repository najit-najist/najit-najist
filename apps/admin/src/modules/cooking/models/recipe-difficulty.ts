import { model } from '@medusajs/framework/utils';

export const RecipeDifficulty = model.define('recipe_difficulty', {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  slug: model.text().unique(),
  color: model.text(),
});
