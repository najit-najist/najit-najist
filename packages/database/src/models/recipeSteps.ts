import { integer, json, pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { recipes } from './recipes';

export const recipeSteps = pgTable('recipe_steps', {
  ...modelsBase,
  recipeId: integer('recipe_id')
    .references(() => recipes.id)
    .notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  parts: json('parts').notNull().default([]),
});
