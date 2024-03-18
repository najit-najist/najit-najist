import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';

export const municipalities = pgTable(
  'municipalities',
  {
    ...modelsBase,
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 256 }).notNull(),
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

// export const municipalitiesRelations = relations(
//   municipalities,
//   ({ many }) => ({
//     orderAddresses: many(orderAddresses),
//     userAddresses: many(userAddresses),
//   })
// );

export type Municipality = typeof municipalities.$inferSelect;
