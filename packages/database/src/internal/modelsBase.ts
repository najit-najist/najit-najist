import { serial, timestamp } from 'drizzle-orm/pg-core';

export const modelsBase = {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
} as const;
