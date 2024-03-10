import { pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const municipalities = pgTable(
  'municipalities',
  {
    ...modelsBase,
    name: varchar('firstname', { length: 256 }).notNull(),
    slug: varchar('firstname', { length: 256 }).notNull(),
  },
  (municipalities) => {
    return {
      nameSlugIndex: uniqueIndex('name_slug_idx').on(
        municipalities.name,
        municipalities.slug
      ),
    };
  }
);

export type Municipality = typeof municipalities.$inferSelect;
