import { integer, varchar } from 'drizzle-orm/pg-core';

import { municipalities } from '../models/municipalities';
import { modelsBase } from './modelsBase';

export const addressModelsBase = {
  ...modelsBase,
  municipalityId: integer('municipality_id')
    .references(() => municipalities.id)
    .notNull(),
  houseNumber: varchar('house_number', { length: 256 }),
  streetName: varchar('city', { length: 256 }),
  city: varchar('city', { length: 256 }),
  postalCode: varchar('postal_code', { length: 256 }),
} as const;
