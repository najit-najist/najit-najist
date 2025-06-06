import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { recipeResources } from './recipeResources';

export const recipeResourceMetrics = pgTable(
  'recipe_resource_metrics',
  withDefaultFields({
    name: varchar('name', { length: 256 }).unique().notNull(),
  }),
);

export const recipeResourceMetricsRelations = relations(
  recipeResourceMetrics,
  ({ many }) => ({
    resources: many(recipeResources),
  }),
);

export type RecipeResourceMetric = typeof recipeResourceMetrics.$inferSelect;
