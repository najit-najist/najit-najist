import { z } from 'zod';

import { addressSchema } from './address.schema';
import { authCollectionSchema } from './auth.collection.schema';
import { municipalitySchema } from './municipality.schema';
import { zodPassword } from './zodPassword';
import { zodTelephoneNumber } from './zodTelephoneNumber';

export enum UserRoles {
  ADMIN = 'ADMIN',
  /**
   * @deprecated - use BASIC instead, this is for users that were registered through intro-web
   */
  NORMAL = 'NORMAL',
  PREMIUM = 'PREMIUM',
  BASIC = 'BASIC',
}

export enum UserStates {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  DEACTIVATED = 'DEACTIVATED',
  DELETED = 'DELETED',
  BANNED = 'BANNED',
  SUBSCRIBED = 'SUBSCRIBED',
}

export type User = z.infer<typeof userSchema>;

const MESSAGES = {
  REQUIRED_FIRST_NAME: 'Zadejte jméno',
  REQUIRED_LAST_NAME: 'Zadejte příjmení',
};

export const userSchema = authCollectionSchema.extend({
  firstName: z
    .string({
      required_error: MESSAGES.REQUIRED_FIRST_NAME,
    })
    .min(1, MESSAGES.REQUIRED_FIRST_NAME),
  lastName: z
    .string({
      required_error: MESSAGES.REQUIRED_LAST_NAME,
    })
    .min(1, MESSAGES.REQUIRED_LAST_NAME),
  avatar: z.string().optional(),
  telephoneNumber: zodTelephoneNumber.nullish(),
  newsletterUuid: z.string().optional(),
  role: z.nativeEnum(UserRoles),
  status: z.nativeEnum(UserStates),
  newsletter: z.boolean().default(true),
  address: addressSchema.optional(),
  notes: z
    .string()
    .transform((item) => (!!item ? item : undefined))
    .optional(),
  lastLoggedIn: z
    .string()
    .transform((item) => (!!item ? item : undefined))
    .nullable()
    .optional(),
});

export const registerUserSchema = userSchema
  .omit({
    newsletterUuid: true,
    role: true,
    status: true,
    address: true,
    lastLoggedIn: true,
    verified: true,
    created: true,
    emailVisibility: true,
    id: true,
    username: true,
    updated: true,
  })
  .extend({
    address: z.object({
      municipality: municipalitySchema.pick({ id: true }),
    }),
    password: zodPassword,
  });

export type RegisterUser = z.input<typeof registerUserSchema>;
