import { integer, pgTable } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { recipes } from './recipes';
import { users } from './users';

export const userLikedRecipes = pgTable(
  'user_liked_recipes',
  withDefaultFields({
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'cascade' })
      .notNull(),
  }),
);
