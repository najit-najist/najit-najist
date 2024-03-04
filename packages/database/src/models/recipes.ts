import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { ownableModel } from '../internal/ownableModel';
import { recipeCategories } from './recipeCategories';
import { recipeDifficulties } from './recipeDifficulties';

export const recipes = pgTable('recipes', {
  ...modelsBase,
  ...ownableModel,
  title: varchar('title', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  description: text('description').notNull(),
  numberOfPortions: integer('number_of_portions').default(1),
  categoryId: integer('category_id')
    .references(() => recipeCategories.id)
    .notNull(),
  difficultyId: integer('difficulty_id')
    .references(() => recipeDifficulties.id)
    .notNull(),
});
