import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { fileFieldType } from '../internal/types/file';
import { withDefaultFields } from '../internal/withDefaultFields';
import { userNewsletters } from './newsletterSubscriptions';
import { telephoneNumbers } from './telephoneNumbers';
import { userAddresses } from './userAddresses';

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
  withDefaultFields({
    email: varchar('email', { length: 256 }).unique().notNull(),
    firstName: varchar('firstname', { length: 256 }).notNull(),
    lastName: varchar('lastname', { length: 256 }).notNull(),
    avatar: fileFieldType('avatar_filepath'),
    role: userRoleEnum('role').default('basic').notNull(),
    status: userStateEnum('status').default(UserStates.INVITED),
    lastLoggedIn: timestamp('last_logged_in', {
      withTimezone: true,
    }),
    telephoneId: integer('telephone_id').references(() => telephoneNumbers.id, {
      onDelete: 'set null',
    }),

    _passwordResetSecret: varchar('password_reset_secret', {
      length: 1064,
    }),
    _registerSecret: varchar('register_secret', {
      length: 1064,
    }),
    _password: varchar('password', { length: 1064 }).notNull(),
  }),
  (users) => {
    return {
      nameIndex: index('name_idx').on(users.firstName, users.lastName),
      email: index('user_email_idx').on(users.email),
    };
  },
);

export const usersRelations = relations(users, ({ one }) => ({
  telephone: one(telephoneNumbers, {
    fields: [users.telephoneId],
    references: [telephoneNumbers.id],
  }),
  newsletter: one(userNewsletters),
  address: one(userAddresses),
}));

export type User = typeof users.$inferSelect;
