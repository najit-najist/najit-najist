import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { recipeResourceMetrics } from './recipeResourceMetrics';
import { recipes } from './recipes';

export const recipeResources = pgTable('recipe_resources', {
  ...modelsBase,
  recipeId: integer('recipe_id')
    .references(() => recipes.id)
    .notNull(),
  metricId: integer('metric_id')
    .references(() => recipeResourceMetrics.id)
    .notNull(),
  count: integer('count').notNull(),
  title: varchar('title', { length: 256 }).unique().notNull(),
  description: text('description').default(''),
  optional: boolean('optional').default(false),
});

export const recipeResourcesRelations = relations(
  recipeResources,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeResources.recipeId],
      references: [recipes.id],
    }),
    metric: one(recipeResourceMetrics, {
      fields: [recipeResources.metricId],
      references: [recipeResourceMetrics.id],
    }),
  })
);

export type RecipeResource = typeof recipeResources.$inferSelect;
