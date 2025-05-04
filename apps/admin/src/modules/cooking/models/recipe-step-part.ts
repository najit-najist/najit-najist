import { model } from '@medusajs/framework/utils';

export const RecipeStepPart = model.define('recipe_step_part', {
  id: model.id().primaryKey(),
  content: model.text(),
  duration: model.number(),
  // ADD STEP_ID
});
