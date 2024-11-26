import { integer } from 'drizzle-orm/pg-core';

import { users } from '../models/users';

export const withOwnableFields = <T extends object>(rest: T) =>
  ({
    createdById: integer('created_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    updateById: integer('updated_by_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...rest,
  }) as const;
