import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const recipeCategories = pgTable('recipe_categories', {
  ...modelsBase,
  title: varchar('title', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
});

export type RecipeCategory = typeof recipeCategories.$inferSelect;
