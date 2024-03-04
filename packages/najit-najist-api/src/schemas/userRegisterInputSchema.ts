import { passwordZodSchema } from '@najit-najist/security';
import { z } from 'zod';

import { municipalitySchema } from './municipality.schema';
import { userSchema } from './user.schema';

export const userRegisterInputSchema = userSchema
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
    password: passwordZodSchema,
  });
