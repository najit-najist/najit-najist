import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { withDefaultFields } from '../internal/withDefaultFields';

export const postCategories = pgTable(
  'post_categories',
  withDefaultFields({
    title: varchar('title', { length: 256 }).unique().notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
  }),
);
