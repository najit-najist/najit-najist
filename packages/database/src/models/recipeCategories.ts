import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';

export const recipeCategories = pgTable(
  'recipe_categories',
  withDefaultFields({
    title: varchar('title', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
  }),
);

export type RecipeCategory = typeof recipeCategories.$inferSelect;
