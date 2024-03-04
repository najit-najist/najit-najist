import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { modelsBase } from '../internal/modelsBase';
import { fileFieldType } from '../internal/types/file';
import { telephoneNumbers } from './telephoneNumbers';

export const UserRoles = {
  ADMIN: 'admin',
  /**
   * @deprecated - use BASIC instead, this is for users that were registered through intro-web
   */
  NORMAL: 'normal',
  PREMIUM: 'premium',
  BASIC: 'basic',
} as const;

export const UserStates = {
  ACTIVE: 'active',
  INVITED: 'invited',
  PASSWORD_RESET: 'password_reset',
  DEACTIVATED: 'deactivated',
  DELETED: 'deleted',
  BANNED: 'banned',
  SUBSCRIBED: 'subscribed',
} as const;

// declaring enum in database
export const userRoleEnum = pgEnum('user_role', [
  UserRoles.ADMIN,
  UserRoles.NORMAL,
  UserRoles.PREMIUM,
  UserRoles.BASIC,
]);

export const userStateEnum = pgEnum('user_state', [
  UserStates.ACTIVE,
  UserStates.INVITED,
  UserStates.PASSWORD_RESET,
  UserStates.DEACTIVATED,
  UserStates.DELETED,
  UserStates.BANNED,
  UserStates.SUBSCRIBED,
]);

export const users = pgTable(
  'users',
  {
    ...modelsBase,
    email: varchar('email', { length: 256 }).notNull(),
    firstName: varchar('firstname', { length: 256 }).notNull(),
    lastName: varchar('firstname', { length: 256 }).notNull(),
    avatar: fileFieldType('avatar_filepath'),
    role: userRoleEnum('role').default('basic').notNull(),
    status: userStateEnum('status').notNull(),
    lastLoggedIn: timestamp('last_logged_in', {
      withTimezone: true,
    }),
    telephoneId: integer('telephone_id').references(() => telephoneNumbers.id),
  },
  (users) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(users.firstName, users.lastName),
    };
  }
);
