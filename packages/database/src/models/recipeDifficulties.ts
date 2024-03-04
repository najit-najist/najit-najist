import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const recipeDifficulties = pgTable('recipe_difficulties', {
  ...modelsBase,
  name: varchar('name', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  color: varchar('color', { length: 20 }).notNull(),
});
