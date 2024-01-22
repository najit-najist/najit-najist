import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

import { addressSchema } from '../address.schema';
import { municipalitySchema } from '../municipality.schema';
import { userSchema } from '../user.schema';

export * from './getManyInput.schema';
export * from './getOneInput.schema';

export const createUserSchema = userSchema
  .omit({
    lastLoggedIn: true,
    newsletterUuid: true,
    role: true,
    status: true,
  })
  .extend({
    address: z.object({
      municipality: municipalitySchema.pick({ id: true }),
    }),
    password: passwordZodSchema,
  });
export const updateUserSchema = createUserSchema
  .omit({ password: true, address: true })
  .extend({
    address: addressSchema.pick({ id: true }).extend({
      municipality: municipalitySchema.pick({ id: true }),
    }),
  })
  .partial();
