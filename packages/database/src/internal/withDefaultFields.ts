import { serial, timestamp } from 'drizzle-orm/pg-core';

export const withDefaultFields = <T extends object>(rest: T) =>
  ({
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    ...rest,
  } as const);
