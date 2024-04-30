import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { recipeResourceMetrics } from './recipeResourceMetrics';
import { recipes } from './recipes';

export const recipeResources = pgTable(
  'recipe_resources',
  withDefaultFields({
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'cascade' })
      .notNull(),
    metricId: integer('metric_id')
      .references(() => recipeResourceMetrics.id, { onDelete: 'restrict' })
      .notNull(),
    count: integer('count').notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    description: text('description').default(''),
    optional: boolean('optional').default(false),
  }),
  (schema) => ({
    uniqueTitleForRecipe: unique('title_for_recipe').on(
      schema.recipeId,
      schema.title
    ),
  })
);

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
