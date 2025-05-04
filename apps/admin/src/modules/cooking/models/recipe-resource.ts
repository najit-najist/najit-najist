import { model } from '@medusajs/framework/utils';

export const RecipeResource = model
  .define('recipe_resource', {
    id: model.id().primaryKey(),
    title: model.text(),
    description: model.text().default(''),
    optional: model.boolean().default(false),
    count: model.number(),
    // RECIPE_ID, METRIC_ID
  })
  .indexes([
    {
      // AND RECIPE_ID
      on: ['title'],
      unique: true,
    },
  ]);
