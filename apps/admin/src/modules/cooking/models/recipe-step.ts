import { model } from '@medusajs/framework/utils';

export const RecipeStep = model
  .define('recipe_step', {
    id: model.id().primaryKey(),
    title: model.text(),
    // RECIPE_ID
  })
  .indexes([
    {
      // AND RECIPE_ID
      on: ['title'],
      unique: true,
    },
  ]);
