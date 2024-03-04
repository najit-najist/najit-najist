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
