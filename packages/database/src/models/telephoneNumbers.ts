import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { telephoneNumberCodes } from './telephoneNumberCodes';

export const telephoneNumbers = pgTable(
  'telephone_numbers',
  {
    ...modelsBase,
    telephone: varchar('telephone', { length: 100 }).notNull(),
    code: varchar('code')
      .references(() => telephoneNumberCodes.code, { onDelete: 'restrict' })
      .notNull(),
  },
  (userTelephoneNumbers) => {
    return {
      telephoneWithCodeIndex: uniqueIndex('telephone_with_index_idx').on(
        userTelephoneNumbers.telephone,
        userTelephoneNumbers.code
      ),
    };
  }
);

export type TelephoneNumber = typeof telephoneNumbers.$inferSelect;
