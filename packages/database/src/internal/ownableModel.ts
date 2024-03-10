import { integer } from 'drizzle-orm/pg-core';

import { users } from '../models/users';

export const ownableModel = {
  createdBy: integer('created_by').references(() => users.id),
  updateBy: integer('updated_by').references(() => users.id),
} as const;
