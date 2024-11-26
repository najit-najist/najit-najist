import { relations } from 'drizzle-orm';
import { integer, json, pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { recipes } from './recipes';

export const recipeSteps = pgTable(
  'recipe_steps',
  withDefaultFields({
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'cascade' })
      .notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    parts: json('parts')
      .$type<{ content: string; duration: number }[]>()
      .notNull()
      .default([]),
  }),
);

export const recipeStepsRelations = relations(recipeSteps, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeSteps.recipeId],
    references: [recipes.id],
  }),
}));

export type RecipeStep = typeof recipeSteps.$inferSelect & {
  parts: { duration: number }[];
};
