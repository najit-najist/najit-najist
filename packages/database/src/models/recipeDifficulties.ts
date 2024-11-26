import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';

export const recipeDifficulties = pgTable(
  'recipe_difficulties',
  withDefaultFields({
    name: varchar('name', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
    color: varchar('color', { length: 20 }).notNull(),
  }),
);

export type RecipeDifficulty = typeof recipeDifficulties.$inferSelect;
