import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const recipeResourceMetrics = pgTable('recipe_resource_metrics', {
  ...modelsBase,
  name: varchar('name', { length: 256 }).unique().notNull(),
});
