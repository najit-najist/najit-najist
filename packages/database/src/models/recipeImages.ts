import { relations } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';

import { fileFieldType } from '../internal/types/file';
import { withDefaultFields } from '../internal/withDefaultFields';
import { recipes } from './recipes';

export const recipeImages = pgTable(
  'recipe_images',
  withDefaultFields({
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'cascade' })
      .notNull(),
    file: fileFieldType('file').notNull(),
  }),
);

export const recipeImagesRelations = relations(recipeImages, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeImages.recipeId],
    references: [recipes.id],
  }),
}));
