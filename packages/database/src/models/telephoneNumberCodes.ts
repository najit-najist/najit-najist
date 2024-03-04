import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const telephoneNumberCodes = pgTable('telephone_number_codes', {
  code: varchar('code', { length: 100 }).unique().primaryKey().notNull(),
  country: varchar('country').notNull(),
});
