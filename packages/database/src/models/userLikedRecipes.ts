import { integer, pgTable } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { recipes } from './recipes';
import { users } from './users';

export const userLikedRecipes = pgTable('user_liked_recipes', {
  ...modelsBase,
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  recipeId: integer('recipe_id')
    .references(() => recipes.id)
    .notNull(),
});
