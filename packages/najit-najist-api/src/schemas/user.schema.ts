import { z } from 'zod';
import { addressSchema } from './address.schema';
import { authCollectionSchema } from './auth.collection.schema';
import { municipalitySchema } from './municipality.schema';
import { zodPassword } from './zodPassword';

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

export const userSchema = authCollectionSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  telephoneNumber: z
    .string()
    .or(z.number())
    .transform(String)
    .refine(
      (value) => {
        return (
          value === undefined ||
          value === null ||
          value === '' ||
          String(value).length === 9
        );
      },
      {
        message: 'Musí být devět čísel bez mezer',
      }
    )
    .nullish(),
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
