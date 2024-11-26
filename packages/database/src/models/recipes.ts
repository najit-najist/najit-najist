import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';
import { withOwnableFields } from '../internal/withOwnableFields';
import { recipeCategories } from './recipeCategories';
import { recipeDifficulties } from './recipeDifficulties';
import { recipeImages } from './recipeImages';
import { recipeResources } from './recipeResources';
import { recipeSteps } from './recipeSteps';

export const recipes = pgTable(
  'recipes',
  withOwnableFields(
    withDefaultFields({
      title: varchar('title', { length: 256 }).unique().notNull(),
      slug: varchar('slug', { length: 256 }).unique().notNull(),
      description: text('description').notNull(),
      numberOfPortions: integer('number_of_portions').default(1),
      categoryId: integer('category_id')
        .references(() => recipeCategories.id, { onDelete: 'restrict' })
        .notNull(),
      difficultyId: integer('difficulty_id')
        .references(() => recipeDifficulties.id, { onDelete: 'restrict' })
        .notNull(),
    }),
  ),
);

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  images: many(recipeImages),
  category: one(recipeCategories, {
    fields: [recipes.categoryId],
    references: [recipeCategories.id],
  }),
  steps: many(recipeSteps),
  difficulty: one(recipeDifficulties, {
    fields: [recipes.difficultyId],
    references: [recipeDifficulties.id],
  }),
  resources: many(recipeResources),
}));

export type Recipe = typeof recipes.$inferSelect;
