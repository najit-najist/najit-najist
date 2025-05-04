import { model } from '@medusajs/framework/utils';

export const Recipe = model.define('recipe', {
  id: model.id().primaryKey(),
  title: model.text().unique().searchable(),
  slug: model.text().unique().searchable(),
  description: model.text(),
  numberOfPortions: model.number().default(1),
  // CATEGORY_ID, DIFFICULTY_ID
});
