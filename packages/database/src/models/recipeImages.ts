import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { fileFieldType } from '../internal/types/file';
import { recipes } from './recipes';

export const recipeImages = pgTable('recipe_images', {
  ...modelsBase,
  recipeId: integer('recipe_id')
    .references(() => recipes.id, { onDelete: 'cascade' })
    .notNull(),
  file: fileFieldType('file').notNull(),
});

export const recipeImagesRelations = relations(recipeImages, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeImages.recipeId],
    references: [recipes.id],
  }),
}));
