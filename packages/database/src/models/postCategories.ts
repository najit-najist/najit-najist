import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const postCategories = pgTable('post_categories', {
  ...modelsBase,
  title: varchar('title', { length: 256 }).unique().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
});
