import { integer } from 'drizzle-orm/pg-core';

import { users } from '../models/users';

export const ownableModel = {
  createdById: integer('created_by_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  updateById: integer('updated_by_id').references(() => users.id, {
    onDelete: 'set null',
  }),
} as const;
